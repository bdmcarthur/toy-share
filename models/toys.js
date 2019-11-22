"use strict";

const mongoose = require("mongoose");

const ToysSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  location: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  _addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviews: [
    {
      email: String,
      title: String,
      comment: String,
      _postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ]
});

const Toy = mongoose.model("Toy", ToysSchema);

module.exports = Toy;
