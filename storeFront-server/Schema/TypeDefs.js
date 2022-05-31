const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Inventory {
    id: ID
    item: String
    price: Int
  }

  type Users {
    id: ID
    username: String
    password: String
  }
  
  type OrderDetail {
    item: String
    amount: Int
  }

  type Orders{
    id: ID
    user: String
    timestamp: String
    order: [OrderDetail]
    price: Int
  }

  # Queries
  type Query {
    getAllItems: [Inventory]
    getItem(id: ID): Inventory
    getUsers: [Users]
    getOrders: [Orders]
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
