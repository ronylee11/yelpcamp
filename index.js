if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//require("dotenv").config();
//console.log(process.env.SECRET);
//console.log(process.env.API_KEY);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
//const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/YelpCamp";
const dbUrl = "mongodb://127.0.0.1:27017/YelpCamp";
const MongoDBStore = require("connect-mongo")(session);

const port = process.env.PORT || 3003;

//mongoose.connect("mongodb://127.0.0.1:27017/YelpCamp");
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //enable req.body to be parsed
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // connect css&js frontend files in public directory

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  //store: mongo, // by default it uses memory storage, goes away on application restart
  cookies: {
    httpOnly: true,
    //secureOnly: true, // only works on https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({ replaceWith: "_" }));
//app.use(helmet({ contentSecurityPolicy: false }));

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];

const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
];

const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];

const fontSrcUrls = [];

//app.use(
//helmet.contentSecurityPolicy({
//directives: {
//defaultSrc: [],
//connectSrc: ["'self'", ...connectSrcUrls],
//scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//workerSrc: ["'self'", "blob:"],
//childSrc: ["blob:"],
//objectSrc: [],
//imgSrc: [
//"'self'",
//"blob:",
//"data:",
//"https://res.cloudinary.com/dylbylzma/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//"https://images.unsplash.com/",
//],
//fontSrc: ["'self'", ...fontSrcUrls],
//},
//})
//);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //console.log(req.query);
  //console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  //res.send("HELLO FROM YELPCAMP!");
  res.render("home");
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "test@gmail.com", username: "colttt" });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//app.get("/makecampground", async (req, res) => {
//const camp = new Campground({
//title: "My Backyard",
//description: "cheap camping!",
//});
//await camp.save();
//res.send(camp);
//});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found!", 401));
});

app.use((err, req, res, next) => {
  //throw new ExpressError(`Error is ${err}`, 401);
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no! Something Went Wrong!";
  //throw new ExpressError(message, status);
  res.status(status).render("error", { err });
});

app.listen(port, () => {
  console.log(`LISTENING FROM PORT ${port}!`);
});
