import {
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    ListPartsCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const Bucket = process.env.S3_BUCKET
const LIFECYCLE_EXPIRY =
    parseInt(process.env.S3_LIFECYCLE_EXPIRY) * 24 * 60 * 60 * 1000

const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
})

export const listObjects = async (prefix: string) => {
    const cmd = new ListObjectsV2Command({
        Bucket,
        Prefix: prefix
    })

    const res = await s3.send(cmd)

    if (res.KeyCount === 0) return []

    return res.Contents.map((obj) => ({
        filename: obj.Key.split('/').pop(),
        etag: obj.ETag.slice(1, -1),
        size: obj.Size,
        expires: new Date(obj.LastModified.getTime() + LIFECYCLE_EXPIRY)
    }))
}

export const deleteObject = async (key: string) => {
    const cmd = new DeleteObjectCommand({
        Bucket,
        Key: key
    })

    await s3.send(cmd)

    return true
}

export const createPresignedPut = async (
    key: string,
    size: number
): Promise<string> => {
    const cmd = new PutObjectCommand({
        Bucket,
        Key: key,
        ContentLength: Math.min(size, 5 * 1024 * 1024)
    })

    return await getSignedUrl(s3, cmd)
}

const PART_SIZE = 8 * 1024 * 1024

export const createMultipartPresignedPut = async (
    key: string,
    size: number
) => {
    const { UploadId } = await s3.send(
        new CreateMultipartUploadCommand({
            Bucket,
            Key: key
        })
    )

    const nbParts = Math.ceil(size / PART_SIZE)

    const parts = Array.from({ length: nbParts }, async (_, i) => {
        const rangeStart = i * PART_SIZE
        const rangeEnd = Math.min(rangeStart + PART_SIZE, size) - 1

        const cmd = new UploadPartCommand({
            Bucket,
            Key: key,
            UploadId,
            PartNumber: i + 1,
            ContentLength: rangeEnd - rangeStart + 1
        })

        return {
            url: await getSignedUrl(s3, cmd),
            partNumber: i + 1,
            rangeStart,
            rangeEnd
        }
    })

    return {
        uploadId: UploadId,
        parts: await Promise.all(parts)
    }
}

export const finishMultipartPresignedPut = async (
    key: string,
    uploadId: string
) => {
    const { Parts } = await s3.send(
        new ListPartsCommand({
            Bucket,
            Key: key,
            UploadId: uploadId
        })
    )

    await s3.send(
        new CompleteMultipartUploadCommand({
            Bucket,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts }
        })
    )

    return true
}
