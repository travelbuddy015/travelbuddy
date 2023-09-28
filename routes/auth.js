const express = require("express");
const passport = require("passport");
const router = express.Router();
const user = require("../models/user");

const {
  getLogin,
  getRegistration,
  postLogin,
  postRegistration,
} = require("../controller/auth_controller");

router.get("/login", getLogin);

router.get("/registration", getRegistration);

router.post("/login", postLogin);
router.get("/login/federated/google", passport.authenticate("google"));
router.post("/registration", postRegistration);

module.exports = router;
