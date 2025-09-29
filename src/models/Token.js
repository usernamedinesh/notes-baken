const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    default: "akljslfafilsfjlsfj",
  },
});

module.exports = mongoose.model("Token", tokenSchema); // use consistent casing
