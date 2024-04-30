const mbxgiocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();
const maptoken = process.env.MAPTOKEN;
const geocodingclint = mbxgiocoding({ accessToken: maptoken });
const listing = require("../models/listing.js");
//const User = require("../models/user.js");
///1strout
module.exports.index = async (req, res) => {
  const allistings = await listing.find({});
  res.render("listing/index.ejs", { allistings });
};
//new rout===============================================
module.exports.newrout = (req, res) => {
  //console.log(req.user);
  res.render("listing/new");
};
////showrout=================================================
module.exports.showrout = async (req, res) => {
  let { id } = req.params;
  const allisting = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  //show comment===========================================
  if (!allisting) {
    req.flash("error", "listing your requese does no exist");
    res.redirect("/listing");
  }
  console.log(allisting);
  res.render("listing/show.ejs", { allisting });
};
///create rout=================================================================
module.exports.create = async (req, res) => {
  let responce = await geocodingclint
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  //res.send("done");
  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.giometry = responce.body.features[0].geometry;
  await newlisting.save();
  req.flash("success", "new listing create");
  res.redirect("/listing");
};
/////edit rout==============================================================================
module.exports.editrout = async (req, res) => {
  let { id } = req.params;
  const editlisting = await listing.findById(id);
  let updetlisting = editlisting.image.url;
  updetlisting.replace("/upload", "/upload/t_fill_square_400");
  res.render("listing/edit.ejs", { editlisting, updetlisting });
};
///updet rout==============================================================================
module.exports.Updet = async (req, res) => {
  let { id } = req.params;
  let updetlisting = await listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updetlisting.image = { url, filename };
    await updetlisting.save();
    console.log(filename, url);
  }
  req.flash("success", "listing is updet");
  res.redirect(`/listing/${id}`);
};
///Delete===================================================================================
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id, { ...req.body.listing });
  res.redirect("/listing");
};
///====================================================
//=====SingUp=======================================

//=======login==============================

//=======logout=================================
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logout!");
    res.redirect("/listing");
  });
};
//========================search===================
module.exports.search = async (req, res, next) => {
  const searce = req.query.q;

  if (searce.length > 0) {
    //req.flash("success", "wellcome to my webside");

    const searchResults = await listing.find({
      $or: [
        { title: { $regex: searce } },
        { country: { $regex: searce } },
        { location: { $regex: searce } },
      ],
    });
    //console.log(searchResults);
    res.render("listing/search", { searchResults });
  } else {
    res.redirect("/listing");
  }

  //req.flash("error", "plese input the filled");
};
