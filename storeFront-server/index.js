const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./Schema/TypeDefs");
const { resolvers } = require("./Schema/Resolvers");
const mongoose = require("mongoose");

const express = require("express");
const app = express();

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  server.applyMiddleware({ app });

  await mongoose.connect("mongodb://127.0.0.1:27017/storeFront", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  } );

  app.listen({ port: 3001 }, () => {
    console.log("SERVER RUNNING ON PORT 3001");
  });
}

startApolloServer(typeDefs, resolvers);
