const mongoose = require("mongoose");

const foodCategories = [
  "asian",
  "beverages",
  "western",
  "dessert",
  "salad",
  "pastries",
];

const ListingSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    name: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    category: { type: String, enum: foodCategories, required: true },
    image: { type: String },
    collectionDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    collection: "listings",
  }
);

const Listings = mongoose.model("Listing", ListingSchema);
module.exports = { Listings, ListingSchema };
