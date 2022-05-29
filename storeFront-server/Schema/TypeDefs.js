const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Inventory {
    id: ID
    item: String
    price: Int
  }

  # Queries
  type Query {
    getAllItems: [Inventory]
  }

    #   input PostInput {
    #     item: String!
    #     price: Int!
    #   }

    #   # Mutations
    #   type Mutation {
    #     createUser(user: PostInput): Inventory!
    #   }
`;

module.exports = { typeDefs };
