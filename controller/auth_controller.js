const passport = require("passport");
const User = require("../models/user");

exports.getLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  data.err = req.flash("error");
  res.render("login", data);
};

exports.getRegistration = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  res.render("register");
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("userlocal", (err, user, info) => {
    if (!user) {
      req.flash("error", "Invalid email         or password");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
};

exports.postRegistration = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    name: req.body.name,
    phone:'',
    city:'',
    gender:'',
    age:0,
    
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("userlocal")(req, res, () => {
      res.redirect("/dashboard");
    });
  });
};
