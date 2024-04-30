const express = require("express");
const Reviewrouter = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/expressError.js");
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { islogdin, Reviewauthor } = require("../midddleware.js");
//const review=require("")
Reviewrouter.post("/", islogdin, async (req, res) => {
  let addlisting = await listing.findById(req.params.id);
  let newrevew = new Review(req.body.Reviews);
  newrevew.author = req.user._id;
  console.log(newrevew);
  if (!newrevew.reating) {
    throw new ExpressError(450, "Reating comment not define");
  }
  if (!newrevew.commend) {
    throw new ExpressError(450, "revew comment not define");
  }
  addlisting.reviews.push(newrevew);
  await newrevew.save();
  await addlisting.save();
  res.redirect(`/listing/${addlisting._id}`);
});
//DELET revew
Reviewrouter.delete(
  "/:reviewId",
  islogdin,
  Reviewauthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}` || "/listing");
  })
);

module.exports = Reviewrouter;
