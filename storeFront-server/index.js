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

  // mongodb://127.0.0.1:27017/storeFront
  // "mongodb+srv://codecode60:breakingmybackoverhere@storefrontcluster.hvoaqpo.mongodb.net/storeFront?retryWrites=true&w=majority"

  await mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  } );

  const PORT = process.env.PORT || 3001

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
  });
}

startApolloServer(typeDefs, resolvers);
