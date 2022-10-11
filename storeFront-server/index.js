const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./Schema/TypeDefs");
const { resolvers } = require("./Schema/Resolvers");
const mongoose = require("mongoose");

const cors = require("cors")
const express = require("express");
const app = express();

app.use(
  cors({
      origin: ["https://node-store-front.netlify.app","https://node-store-front.netlify.app/"],
      credentials: true,
      methods: "PUT,POST,GET,DELETE,OPTIONS",
  })
)
// "https://node-store-front.netlify.app/"



async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  server.applyMiddleware({ app });

  // mongodb://127.0.0.1:27017/storeFront
  // "mongodb+srv://codecode60:breakingmybackoverhere@storefrontcluster.hvoaqpo.mongodb.net/storeFront?retryWrites=true&w=majority"
  // process.env.DATABASE
  await mongoose.connect("mongodb+srv://codecode60:breakingmybackoverhere@storefrontcluster.hvoaqpo.mongodb.net/storeFront?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  } );

  const PORT = process.env.PORT || 3001

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
  });
}

startApolloServer(typeDefs, resolvers);
