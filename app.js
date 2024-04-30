const express = require("express");
const mongo = require("mongoose");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
//const dbconnect = "mongodb://127.0.0.1:27017/Whatshap";
const ExpressError = require("./util/expressError.js");
const Routerss = require("./routes/listing.js");
const ReviewRouterss = require("./routes/Review.js");
//const UserRouter = require("./models/user.js");
const clisting = require("./Controler/listing.js");
require("dotenv").config();
const dbUrl = process.env.Databas_Api;
const wrapAsync = require("./util/wrapAsync.js");
//const ExpressError = require("./util/expressError.js");
const core = require("cors");
//++++++++ Athnticate requir========
const session = require("express-session");
const MongoStore = require("connect-mongo");
const coockeperser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
///add data base=======
const User = require("./models/user.js");
const { saveRedireactUrl } = require("./midddleware.js");
const Listing = require("./models/listing.js");
const { error } = require("console");
const { title } = require("process");
///<<----------------->>>>
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//==========
app.engine("ejs", engine);
app.use(coockeperser());

const store = MongoStore.create({
  mongoUrl: dbUrl,
  //mongoOptions:advancedOptions
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const expression = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date() + 7 * 24 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(core());
app.use(flash());
app.use(session(expression));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
///local variable
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
/////<--------------database connect--------------->
abhi()
  .then(() => {
    console.log("connection is succesful");
  })
  .catch((errr) => {
    console.log(errr);
  });
async function abhi() {
  await mongo.connect(dbUrl);
}
//================listing&reviewrout =============================
app.use("/listing", Routerss);
app.use("/listing/:id/Reviews", ReviewRouterss);
app.get("/search", clisting.search);

app.post(
  "/login",
  saveRedireactUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    ///reduract orjinal path
    req.flash("success", "wellcome to Wndwrlist");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }
);

////============alll rout===================

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const registerUser = await User.register(newuser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "wellcome to my webside");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/SignUp");
  }
});
///=========restApi=============

app.get("/getapi", async (req, res) => {
  // let { id } = req.params;
  let restapi = await Listing.find({});
  res.send(restapi);
});

//==============signUppagr================================
app.get("/signUp", (req, res) => {
  res.render("listing/SignUp");
});
//app.post("/signUp", wrapAsync(clisting.accunt));

//================loginpage===============================
app.get("/login", (req, res) => {
  res.render("listing/login");
});
////=============================loginpost==============

////logout=======================================================
app.get("/logOut", clisting.logout);
//=====================search=======================================
app.get("/search", clisting.search);
//<+=============serverschima----====================================>

///===================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page is notfound"));
});

app.use((err, req, res, next) => {
  let { statasCode = 504, message = "sumthing is rong!" } = err;
  res.render("error.ejs", { message, statasCode });
});
//<---------server port---------->
app.listen(port, () => {
  console.log(`app is ranning ${port}`);
});
//<--------------------!>
