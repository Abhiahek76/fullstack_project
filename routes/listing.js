const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
//const ExpressError = require("../util/expressError.js");
const listing = require("../models/listing.js");
const { islogdin, isOwner } = require("../midddleware.js");
const { equal } = require("joi");
const multer = require("multer");
const listingControler = require("../Controler/listing.js");
const { storage } = require("../confic.js");
const upload = multer({ storage });
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

router.get("/", wrapAsync(listingControler.index));
//new rout============================
router.get("/new", islogdin, listingControler.newrout);
//show rout============================
router.get("/:id", wrapAsync(listingControler.showrout));
//create rout====================
router.post(
  "/",
  islogdin,
  upload.single("listing[image]"),
  wrapAsync(listingControler.create)
);
//edit rout===============================
router.get(
  "/:id/edit",
  islogdin,
  isOwner,
  wrapAsync(listingControler.editrout)
);
//updetrout===================================
router.put(
  "/:id",
  islogdin,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingControler.Updet)
);
//deletrout==================================
router.delete("/:id", islogdin, islogdin, wrapAsync(listingControler.delete));

module.exports = router;
