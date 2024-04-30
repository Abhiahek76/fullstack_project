const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchima = new Schema({
  email: {
    type: String,
    required: true,
  },
});

UserSchima.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchima);
