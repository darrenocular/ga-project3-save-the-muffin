const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    cartQuantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CartItem", CartItemSchema);
