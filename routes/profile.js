const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
} = require("../controller/profile_controller");
router.get("/profile", getProfile);
// router.post('/profile',updateProfile);
module.exports = router;
