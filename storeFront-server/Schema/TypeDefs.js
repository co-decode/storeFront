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

  type User {
    username: String
  }
  

  # Queries
  type Query {
    getAllItems: [Inventory]
    getItemsPaged(limit: Int, offset: Int): [Inventory]
    getItem(id: ID): Inventory
    getUsers: [Users]
    getUser(id:ID): Users
    checkLogin(username: String, password: String): [Users]
    checkExistence(username:String): [User]
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
    updatePass(id: ID, password: String): Users
    appendOrder(id: ID, orders: [OrderInput]): Users

    createOrder(ordered: OrderInput): Orders!
    cancelOrder(id1: ID, id2: ID): Users
  }
`;



module.exports = { typeDefs };
