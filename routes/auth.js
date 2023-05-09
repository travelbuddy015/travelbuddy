const express = require("express");
const passport = require("passport");
const router = express.Router();
const user = require("../models/user");

// GET requests
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  res.render("login");
});

router.get("/registration", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  res.render("register");
});

// POST requests
router.post(
  "/login",
  passport.authenticate("userlocal", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.post("/registration", (req, res) => {
  const temp = new user({
    username: req.body.username,
    name: req.body.name,
  });

  user.register(temp, req.body.password, (err, item) => {
    if (err) {
      console.log(err);
      res.render("register");
    }
    passport.authenticate("userlocal")(req, res, () => {
      res.redirect("/dashboard");
    });
  });
});

module.exports = router;
