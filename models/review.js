//const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newschima = new Schema({
  commend: String,
  reating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", newschima);
