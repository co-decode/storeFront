const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  item: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
  },
  image: String,
});
const Inv = mongoose.model("Inventory", InventorySchema, "Inventory");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});
const Users = mongoose.model("Users", UserSchema, "Users");


const OrderDetail = new mongoose.Schema({
  item: String,
  amount: Number,
});

const OrderSchema = new mongoose.Schema({
  user: String,
  timestamp: String,
  order: [OrderDetail],
  price: Number,
});
const Orders = mongoose.model("Orders", OrderSchema, "Orders")

module.exports = { Inv, Users, Orders };
