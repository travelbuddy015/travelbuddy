const express = require("express");
const passport = require("passport");
const router = express.Router();
const user = require("../models/user");

const {
  getLogin,
  getRegistration,
  postLogin,
  postRegistration,
  sendMail,
  verifyUser,
} = require("../controller/auth_controller");

router.get("/login", getLogin);

router.get("/registration", getRegistration);

router.post("/login", postLogin);
router.post("/send-email", sendMail);
router.get("/login/federated/google", passport.authenticate("google"));
router.post("/registration", postRegistration);
router.get("/verify/:token", verifyUser);

module.exports = router;
