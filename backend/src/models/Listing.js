const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({});

module.exports = mongoose.model("Listing", ListingSchema);
