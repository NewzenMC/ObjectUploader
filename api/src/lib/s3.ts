import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    S3Client
} from '@aws-sdk/client-s3'

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
