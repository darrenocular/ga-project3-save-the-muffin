const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({});

module.exports = mongoose.model("Auth", AuthSchema);
