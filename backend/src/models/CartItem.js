const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({});

module.exports = mongoose.model("CartItem", CartItemSchema);
