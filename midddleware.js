const listing = require("./models/listing");
const reviews = require("./models/review");

///////////
module.exports.islogdin = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    //orginal path url
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedireactUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log(req.session.redirectUrl);
  }

  next();
};
/////parmision related
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permision to edit");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.Reviewauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await reviews.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permision to edit");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
