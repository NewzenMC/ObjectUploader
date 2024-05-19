import React, { useState } from 'react'

import {
    Alert,
    Button,
    Checkbox,
    Code,
    List,
    Modal,
    Skeleton,
    Space,
    Table
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconAlertTriangle, IconRefresh, IconTrash } from '@tabler/icons-react'
import { DateTime } from 'luxon'
import prettyBytes from 'pretty-bytes'
import type { ObjectsQuery, ObjectsQueryVariables } from 'types/graphql'

import {
    CellFailureProps,
    CellSuccessProps,
    TypedDocumentNode,
    useMutation
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
    ObjectsQuery,
    ObjectsQueryVariables
> = gql`
    query ObjectsQuery {
        objects {
            filename
            etag
            size
            expires
        }
    }
`

const tableHead = (
    objects: ObjectsQuery['objects'] = [],
    selectedRows: string[] = [],
    setSelectedRows: React.Dispatch<React.SetStateAction<string[]>> = () => {}
) => (
    <Table.Thead>
        <Table.Tr>
            <Table.Th w={'1.25rem'}>
                <Checkbox
                    aria-label="Select all"
                    disabled={objects.length === 0}
                    checked={
                        selectedRows.length === objects.length &&
                        objects.length > 0
                    }
                    onChange={(event) =>
                        setSelectedRows(
                            event.currentTarget.checked
                                ? objects.map((object) => object.filename)
                                : []
                        )
                    }
                />
            </Table.Th>
            <Table.Th>Filename</Table.Th>
            <Table.Th>ETag</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th>Expires</Table.Th>
        </Table.Tr>
    </Table.Thead>
)

export const Loading = () => (
    <Table>
        {tableHead()}
        <Table.Tbody>
            {[...Array(8)].map((_, i) => (
                <Table.Tr key={i}>
                    <Table.Td>
                        <Skeleton height={'1.25rem'} width={'1.25rem'} />
                    </Table.Td>
                    <Table.Td>
                        <Skeleton height={'1em'} width={'100%'} />
                    </Table.Td>
                    <Table.Td>
                        <Skeleton height={'1em'} width={'100%'} />
                    </Table.Td>
                    <Table.Td>
                        <Skeleton height={'1em'} width={'100%'} />
                    </Table.Td>
                    <Table.Td>
                        <Skeleton height={'1em'} width={'100%'} />
                    </Table.Td>
                </Table.Tr>
            ))}
        </Table.Tbody>
    </Table>
)

export const Empty = () => (
    <Table>
        {tableHead()}
        <Table.Tbody>
            <Table.Tr>
                <Table.Td colSpan={5}>No objects found.</Table.Td>
            </Table.Tr>
        </Table.Tbody>
    </Table>
)

export const Failure = ({ error }: CellFailureProps) => (
    <>
        <Alert
            variant="filled"
            color="red"
            title="Error"
            icon={<IconAlertTriangle />}
        >
            {error?.message}
        </Alert>

        <Space h="md" />

        <Table>
            {tableHead()}
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td colSpan={5}>No objects found.</Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    </>
)

const DELETE_OBJECT_MUTATION = gql`
    mutation DeleteObjectMutation($filename: String!) {
        deleteObject(filename: $filename)
    }
`

export const Success = ({
    objects,
    queryResult: { refetch }
}: CellSuccessProps<ObjectsQuery>) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [opened, { open, close }] = useDisclosure(false)
    const [deleteObject] = useMutation(DELETE_OBJECT_MUTATION)

    const deleteSelected = async () => {
        for (const filename of selectedRows) {
            await deleteObject({
                variables: { filename }
            })
        }

        setSelectedRows([])

        await refetch()
        close()
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="Confirm Deletion">
                <Space h="md" />

                <Alert
                    variant="filled"
                    color="red"
                    title="Are you sure you want to delete these objects?"
                    icon={<IconAlertTriangle />}
                >
                    <List>
                        {selectedRows.map((filename) => (
                            <List.Item key={filename}>{filename}</List.Item>
                        ))}
                    </List>
                </Alert>

                <Space h="md" />

                <Button
                    variant="outline"
                    color="red"
                    fullWidth
                    onClick={deleteSelected}
                >
                    Delete
                </Button>
            </Modal>

            <Button variant="outline" color="grey" fullWidth onClick={refetch}>
                <IconRefresh />
            </Button>

            <Space h="md"/>

            <Table stickyHeader>
                {tableHead(objects, selectedRows, setSelectedRows)}
                <Table.Tbody>
                    {objects.map((object) => (
                        <Table.Tr key={object.filename}>
                            <Table.Td>
                                <Checkbox
                                    aria-label="Select row"
                                    checked={selectedRows.includes(
                                        object.filename
                                    )}
                                    onChange={(event) =>
                                        setSelectedRows(
                                            event.currentTarget.checked
                                                ? [
                                                      ...selectedRows,
                                                      object.filename
                                                  ]
                                                : selectedRows.filter(
                                                      (position) =>
                                                          position !==
                                                          object.filename
                                                  )
                                        )
                                    }
                                />
                            </Table.Td>
                            <Table.Td>{object.filename}</Table.Td>
                            <Table.Td>
                                <Code>{object.etag}</Code>
                            </Table.Td>
                            <Table.Td>{prettyBytes(object.size)}</Table.Td>
                            <Table.Td>
                                {DateTime.fromISO(object.expires).toRelative()}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <Space h="md" />

            <Button
                variant="outline"
                color="red"
                fullWidth
                disabled={selectedRows.length === 0}
                onClick={open}
            >
                <IconTrash />
            </Button>
        </>
    )
}
