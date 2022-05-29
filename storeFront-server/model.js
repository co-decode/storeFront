const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  item: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
  },
});

const Inv = mongoose.model("Inventory", PostSchema, "Inventory");
module.exports = Inv;
