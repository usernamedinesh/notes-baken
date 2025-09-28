const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [imageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
