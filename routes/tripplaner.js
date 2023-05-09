const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./helper");

router.get("/dashboard", isLoggedIn, function (req, res) {
  const data = {};
  data.user = req.user;
  res.render("dashboard", { data });
});

module.exports = router;
