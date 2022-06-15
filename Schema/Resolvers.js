const { Inv, Users } = require("../model");

const resolvers = {
  Query: {
    // Inventory
    getAllItems: async () => {
      return await Inv.find();
    },
    getItemsPaged: async(p, {limit, offset}) => {
      return await Inv.find().skip(offset * limit).limit(limit)
    },
    getItem: async (parent, { id }, context, info) => {
      return await Inv.findById(id);
    },
    // Users
    getUsers: async () => {
      return await Users.find();
    },
    getUser: async (p, {id}) => {
      return await Users.findById(id);
    },
    checkLogin: async(p, {username, password}) => {
      return await Users.find({username, password});
    },
    checkExistence: async(p, {username}) => {
      return await Users.find({username});
    },
  },

  Mutation: {
    // Inventory
    createItem: async (parent, args) => {
      const { item, price } = args.inventory_item;
      const inventory_item = new Inv({ item, price });
      await inventory_item.save();
      return inventory_item;
    },
    deleteItem: async (parent, args, context, info) => {
      const { id } = args;
      await Inv.findByIdAndDelete(id);
      return "Item has been deleted";
    },
    updateItem: async (parent, args, context, info) => {
      const { id } = args
      const { item, price } = args.inventory_item;
      const updates = {};
      if (item !== undefined) {
        updates.item = item;
      }
      if (price !== undefined) {
        updates.price = price;
      }
      const itemUp = await Inv.findByIdAndUpdate(id, updates, { new: true });
      return itemUp;
    },

    //Users
    createUser: async (p, args) => {
      const { username, password } = args.user;
      const res = await Users.find({username:username})
      if (!res[0]){
        const user = new Users({ username, password });
        await user.save();
        return user;
      }
      return {username: "FAILED"}
    },
    deleteUser: async (p, args) => {
      await Users.findByIdAndDelete(args.id);
      return "User has been deleted"
    },
    updatePass: async (p,args) => {
      const {id, password} = args;
      // const {password} = args.user;
      const updates = {};
      if (password !== undefined) {
        updates.password = password;
      }
      const userUp = await Users.findByIdAndUpdate(id, updates, {new:true});
      return userUp;
    },
    appendOrder: async (p,args) => {
      const {id, orders} = args;
      const orderUp = await Users.findByIdAndUpdate(id, {$push:{orders}}, {new:true});
      return orderUp;
    },
    cancelOrder: async (p,args) => {
      const {id1,id2} = args;
      const orderDown = await Users.findByIdAndUpdate(id1, {$pull:{orders: {_id: id2} }}, {new:true} )
      return orderDown
    }
    
  },
};

module.exports = { resolvers };
