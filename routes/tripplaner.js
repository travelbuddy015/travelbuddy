const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/helper");
const Trip = require("../models/trip");
const users = require("../models/user");
const {
  getDashboard,
  postTrip,
  getTrip,
  saveCity,
  saveMembers,
} = require("../controller/tripplaner_controller");
const { getTrainlist } = require("../controller/transportation_controller");

// GET
router.get("/dashboard", isLoggedIn, getDashboard);
router.get("/trip/edit/:id", getTrip);
router.get("/trip/edit/:id/trainlist", getTrainlist);

// POST
router.post("/trip", postTrip);
router.post("/trip/save-city", saveCity);
router.post("/trip/save-member", saveMembers);

module.exports = router;
