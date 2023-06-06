const express = require("express");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const db = require("./database/connection");
const auth = require("./routes/auth");
const index = require("./routes/index");
const path = require("path");
const user = require("./models/user");
const profile = require("./routes/profile");
const mytrip = require("./routes/mytrip");
const dashboard = require("./routes/tripplaner");
const app = express();
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const { Mongoose } = require("mongoose");
app.use(express.static(path.join(__dirname, "public")));
db();
// view engine setup
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(bodyParser.json());
app.use(flash());
// passport.js config
app.use(
  session({
    secret: "Hakuna mata taa...!",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.url,
      ttl: 3600,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use("userlocal", new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.findById(id, (err, user) => {
    if (err) return done(err, null);
    if (user) return done(null, user);
  });
});

// Handle routes
app.use(index);
app.use(auth);
app.use(dashboard);
app.use(profile);
app.use(mytrip);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started At Port 3000");
  }
});
