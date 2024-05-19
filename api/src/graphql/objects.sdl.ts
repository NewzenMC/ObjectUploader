export const schema = gql`
    type Object {
        filename: String!
        etag: String!
        size: Int!
        expires: DateTime!
    }

    type Query {
        objects(prefix: String): [Object!]! @requireAuth
    }

    type Mutation {
        deleteObject(filename: String!): Boolean! @requireAuth
    }
`
