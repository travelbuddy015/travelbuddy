const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/isAdmin");
const {
  getProfile,
  updateProfile,
  getManageUser,
  getUserDetails,
  deleteUser,
} = require("../controller/profile_controller");
router.get("/profile", getProfile);
router.post("/profile", updateProfile);
router.get("/manageuser", isAdmin, getManageUser);
router.get("/manageuser/:id", isAdmin, getUserDetails);
router.get("/deleteuser/:id", isAdmin, deleteUser);
module.exports = router;
