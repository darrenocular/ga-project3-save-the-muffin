const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    purchaseQuantity: { type: Number, required: true },
    isCollected: { type: Boolean, default: false },
    totalPrice: { type: Number, default: () => purchaseQuantity * totalPrice },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

module.exports = mongoose.model("Order", OrderSchema);
