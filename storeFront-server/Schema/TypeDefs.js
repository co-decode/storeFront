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
    getItem(id: ID): Inventory
  }

  input InvInput {
    item: String
    price: Int
  }

  # Mutations
  type Mutation {
    createItem(inventory_item: InvInput): Inventory!
    deleteItem(id: ID): String
    updateItem(id: ID, inventory_item: InvInput): Inventory
  }
`;

module.exports = { typeDefs };
