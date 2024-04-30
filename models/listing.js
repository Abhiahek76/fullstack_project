//const { ref } = require("joi");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { number } = require("joi");
//const User = require("./user.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: { type: String, required: true },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  images: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  giometry: {
    enum: ["point"],
    coordinates: [],
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  },
});
//==========Handeling Review===========>
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
////==========Handeling Review===========>
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
