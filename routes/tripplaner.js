const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/helper");
const Trip = require("../models/trip");
const users = require("../models/user");
const {
  getDashboard,
  postPlanning,
  getPlaning,
} = require("../controller/tripplaner_controller");
router.get("/dashboard", isLoggedIn, getDashboard);

router.post("/planning", postPlanning);
router.get("/planning",getPlaning);

module.exports = router;
