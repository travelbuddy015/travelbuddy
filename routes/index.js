const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("home");
});

router.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect("/");
});
module.exports = router;
