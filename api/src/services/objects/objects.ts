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
