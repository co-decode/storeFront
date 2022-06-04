const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Inventory {
    id: ID
    item: String
    price: Int
    image: String
  }

  type OrderDetail {
    item: String
    amount: Int
    price: Int
  }

  type Orders{
    id: ID
    date: String
    items: [OrderDetail]
    total: Int
  }

  type Users {
    id: ID
    username: String
    password: String
    orders: [Orders]
  }
  

  # Queries
  type Query {
    getAllItems: [Inventory]
    getItemsPaged(limit: Int, offset: Int): [Inventory]
    getItem(id: ID): Inventory
    getUsers: [Users]
    getOrders: [Orders]
    checkUser(username: String): [Users]
  }

  input InvInput {
    item: String
    price: Int
  }

  input UserInput {
    username: String
    password: String
    orders: [OrderInput]
  }


  input OrderDetailInput {
    item: String
    amount: Int
    price: Int
  }

  input OrderInput {
    date: String
    items: [OrderDetailInput]
    total: Int
  }

  # Mutations
  type Mutation {
    createItem(inventory_item: InvInput): Inventory!
    deleteItem(id: ID): String
    updateItem(id: ID, inventory_item: InvInput): Inventory

    createUser(user: UserInput): Users!
    deleteUser(id: ID): String
    updateUser(id: ID, user: UserInput): Users
    appendOrder(id: ID, user: UserInput): Users

    createOrder(ordered: OrderInput): Orders!
    cancelOrder(id1: ID, id2: ID): Users
  }
`;



module.exports = { typeDefs };
