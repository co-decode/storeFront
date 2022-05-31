const {Inv, Users, Orders} = require("../model");

const resolvers = {
  Query: {
  // Inventory
    getAllItems: async () => {
      return await Inv.find();
    },
    getItem: async (parent, { id }, context, info) => {
      return await Inv.findById(id);
    },
  // Users
    getUsers: async () => {
      return await Users.find();
    },
  // Orders
    getOrders: async () => {
      return await Orders.find();
    }
  },

  Mutation: {
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
    updateItem: async( parent, args, context, info) => {
      const { id } = args
      const {item, price } = args.inventory_item;
      const updates = {};
      if (item !== undefined) {
        updates.item = item;
      }
      if (price !== undefined) {
        updates.price = price;
      }
      const itemUp = await Inv.findByIdAndUpdate(id, updates, {new:true});
      return itemUp;
    },
  },
};

module.exports = { resolvers };
