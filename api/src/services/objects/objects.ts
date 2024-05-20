import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import * as s3 from 'src/lib/s3'

export const objects: QueryResolvers['objects'] = ({ prefix }) => {
    return s3.listObjects([context.currentUser.id, '/', prefix].join(''))
}

export const deleteObject: MutationResolvers['deleteObject'] = ({
    filename
}) => {
    return s3.deleteObject(context.currentUser.id + '/' + filename)
}

export const createPresignedPut: MutationResolvers['createPresignedPut'] = ({
    filename,
    size
}) => {
    return s3.createPresignedPut(context.currentUser.id + '/' + filename, size)
}

export const createMultipartPresignedPut: MutationResolvers['createMultipartPresignedPut'] =
    ({ filename, size }) => {
        return s3.createMultipartPresignedPut(
            context.currentUser.id + '/' + filename,
            size
        )
    }

export const finishMultipartPresignedPut: MutationResolvers['finishMultipartPresignedPut'] =
    ({ uploadId, filename }) => {
        return s3.finishMultipartPresignedPut(
            context.currentUser.id + '/' + filename,
            uploadId
        )
    }
