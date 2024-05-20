import { useEffect, useState } from 'react'

import {
    Alert,
    Button,
    Group,
    List,
    Progress,
    rem,
    Slider,
    Space,
    Title
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import {
    IconCheck,
    IconClock,
    IconCloudUpload,
    IconFileInfo,
    IconFileUpload,
    IconHome,
    IconSend,
    IconX
} from '@tabler/icons-react'
import prettyBytes from 'pretty-bytes'
import { MultipartPresignedPutPart } from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

const CREATE_PRESIGNED_URL = gql`
    mutation CreatePresignedPut($filename: String!, $size: Int!) {
        createPresignedPut(filename: $filename, size: $size)
    }
`

const CREATE_MULTIPART_PRESIGNED_URL = gql`
    mutation CreateMultipartPresignedPut($filename: String!, $size: BigInt!) {
        createMultipartPresignedPut(filename: $filename, size: $size) {
            uploadId
            parts {
                url
                partNumber
                rangeStart
                rangeEnd
            }
        }
    }
`

const FINISH_MULTIPART_PRESIGNED_URL = gql`
    mutation FinishMultipartPresignedPut(
        $filename: String!
        $uploadId: String!
    ) {
        finishMultipartPresignedPut(filename: $filename, uploadId: $uploadId)
    }
`

type ProgressObject = {
    [key: number]: number
    length: number
}

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [nbParallel, setNbParallel] = useState(10)
    const [progress, setProgress] = useState<ProgressObject>({ length: 0 })
    const [finished, setFinished] = useState(false)
    const [timer, setTimer] = useState<number>(0)
    const [createURL] = useMutation(CREATE_PRESIGNED_URL)
    const [createMultipart] = useMutation(CREATE_MULTIPART_PRESIGNED_URL)
    const [finishMultipart] = useMutation(FINISH_MULTIPART_PRESIGNED_URL)

    useEffect(() => {
        if (uploading) {
            const timeout = setTimeout(() => {
                if (uploading) setTimer(timer + 0.1)
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [timer, uploading])

    const upload = async () => {
        setUploading(true)

        const multipart = file.size > 8 * 1024 * 1024

        if (!multipart) {
            const url = (
                await createURL({
                    variables: { filename: file.name, size: file.size }
                })
            ).data.createPresignedPut

            const xhr = new XMLHttpRequest()
            xhr.open('PUT', url)
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    setProgress({
                        length: 1,
                        1: (e.loaded / e.total) * 100
                    })
                }
            })

            const prom = new Promise((resolve) => {
                xhr.addEventListener('loadend', () => {
                    resolve(xhr.readyState === 4 && xhr.status === 200)
                })
            })

            xhr.send(file)

            prom.finally(() => {
                setFinished(true)
                setUploading(false)
            })
        }

        const { uploadId, parts } = (
            await createMultipart({
                variables: { filename: file.name, size: file.size }
            })
        ).data.createMultipartPresignedPut

        setProgress({ length: parts.length })

        const xhrs: [() => void, Promise<boolean>, XMLHttpRequest][] =
            parts.map((part: MultipartPresignedPutPart) => {
                const xhr = new XMLHttpRequest()
                xhr.open('PUT', part.url)
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        setProgress((prev) => ({
                            ...prev,
                            [part.partNumber]:
                                (e.loaded / e.total / parts.length) * 100
                        }))
                    }
                })

                const prom = new Promise((resolve) => {
                    xhr.addEventListener('loadend', () => {
                        resolve(xhr.readyState === 4 && xhr.status === 200)
                    })
                })

                const start = xhr.send.bind(
                    xhr,
                    file.slice(part.rangeStart, part.rangeEnd + 1)
                )

                return [start, prom, xhr]
            })

        const cb = () => {
            if (xhrs.length === 0) return
            const [start, prom] = xhrs.shift()
            prom.catch(() => null).finally(cb)
            try {
                start()
            } catch (e) {
                /* empty */
            }
        }

        if (nbParallel === 1) {
            cb()
        } else {
            xhrs.slice(0, nbParallel - 1).forEach(([start, prom]) => {
                prom.finally(cb)
                start()
            })
        }

        Promise.all(xhrs.map(([, prom]) => prom)).then(() => {
            finishMultipart({
                variables: { filename: file.name, uploadId }
            }).then(() => {
                setFinished(true)
                setUploading(false)
            })
        })
    }

    return (
        <>
            <Metadata title="Upload" description="Upload page" />

            <Space h="xl" />

            <Title>Upload</Title>

            <Link to={routes.home()}>
                <Button fullWidth mt="md" radius="md">
                    <IconHome />
                </Button>
            </Link>

            <Space h="md" />

            <Dropzone
                disabled={uploading}
                multiple={false}
                onDrop={(files) => {
                    setFinished(false)
                    setProgress({ length: 0 })
                    setTimer(0)
                    setFile(files[0])
                }}
            >
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: 'none' }}
                >
                    <Dropzone.Accept>
                        <IconFileUpload
                            style={{
                                width: rem(100),
                                height: rem(100),
                                color: 'var(--mantine-color-blue-6)'
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            style={{
                                width: rem(100),
                                height: rem(100),
                                color: 'var(--mantine-color-red-6)'
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconCloudUpload
                            style={{
                                width: rem(100),
                                height: rem(100),
                                color: 'var(--mantine-color-dimmed)'
                            }}
                            stroke={1.5}
                        />
                    </Dropzone.Idle>
                </Group>
            </Dropzone>

            <Space h="md" />

            <Alert
                variant="light"
                color="blue"
                title="Information"
                icon={<IconFileInfo />}
            >
                <List>
                    <List.Item key={'filename'}>
                        Filename: {file?.name ?? 'N/A'}
                    </List.Item>
                    <List.Item key={'size'}>
                        Size: {file ? prettyBytes(file.size) : 'N/A'}
                    </List.Item>
                </List>
            </Alert>

            <Space h="md" />

            <Progress
                transitionDuration={200}
                value={
                    Object.values(progress).reduce((acc, curr) => acc + curr) -
                    progress.length
                }
                color={finished ? 'green' : 'orange'}
                striped
                animated={uploading}
            ></Progress>

            <Space h="md" />

            <Button
                disabled={!file || uploading}
                loading={uploading}
                fullWidth
                color={finished ? 'green' : 'blue'}
                onClick={finished ? navigate.bind(null, routes.list()) : upload}
            >
                {finished ? <IconCheck /> : <IconSend />}
            </Button>

            <Space h="md" />

            <Slider
                disabled={uploading}
                min={1}
                max={50}
                defaultValue={nbParallel}
                onChangeEnd={setNbParallel}
            />

            <Space h="md" />

            <Alert
                variant="light"
                color={!uploading ? 'gray' : finished ? 'green' : 'orange'}
                title={timer.toFixed(1) + 's'}
                icon={<IconClock />}
            />
        </>
    )
}

export default UploadPage
