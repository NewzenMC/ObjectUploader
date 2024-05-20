export const schema = gql`
    type Object {
        filename: String!
        etag: String!
        size: BigInt!
        expires: DateTime!
    }

    type MultipartPresignedPutPart {
        url: String!
        partNumber: Int!
        rangeStart: BigInt!
        rangeEnd: BigInt!
    }

    type MultipartPresignedPut {
        uploadId: String!
        parts: [MultipartPresignedPutPart!]!
    }

    type Query {
        objects(prefix: String): [Object!]! @requireAuth
    }

    type Mutation {
        deleteObject(filename: String!): Boolean! @requireAuth

        createPresignedPut(filename: String!, size: Int!): String! @requireAuth

        createMultipartPresignedPut(
            filename: String!
            size: BigInt!
        ): MultipartPresignedPut! @requireAuth

        finishMultipartPresignedPut(
            filename: String!
            uploadId: String!
        ): Boolean! @requireAuth
    }
`
