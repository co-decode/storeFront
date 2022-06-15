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

const OrderDetail = new mongoose.Schema({
  item: String,
  amount: Number,
  price: Number,
});

const OrderSchema = new mongoose.Schema({
  date: String,
  items: [OrderDetail],
  total: Number,
});
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  orders: [OrderSchema],
});
const Users = mongoose.model("Users", UserSchema, "Users");


// const Orders = mongoose.model("Orders", OrderSchema, "Orders")

module.exports = { Inv, Users };
