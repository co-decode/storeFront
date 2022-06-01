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

  input UserInput {
    username: String
    password: String
  }


  input OrderDetailInput {
    item: String
    amount: Int
  }

  input OrderInput {
    user: String
    timestamp: String
    order: [OrderDetailInput]
    price: Int
  }

  # Mutations
  type Mutation {
    createItem(inventory_item: InvInput): Inventory!
    deleteItem(id: ID): String
    updateItem(id: ID, inventory_item: InvInput): Inventory

    createUser(user: UserInput): Users!
    deleteUser(id: ID): String
    updateUser(id: ID, user: UserInput): Users

    createOrder(ordered: OrderInput): Orders!
    cancelOrder(id: ID): String
  }
`;



module.exports = { typeDefs };
