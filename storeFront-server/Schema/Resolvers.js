const Inv = require("../model");

const resolvers = {
  Query: {
    getAllItems: async() => {
      //This is where the database request is made for MONGO
      return await Inv.find();
    },
  },
  // mutations
//   Mutation: {
//     createUser(parent, args) {
//       const newUser = args.user;
//       const post = new Post({})
//       await post.save()
//     //   users.push(newUser);
//       return newUser;
//     },
//   },
};

module.exports = { resolvers };
