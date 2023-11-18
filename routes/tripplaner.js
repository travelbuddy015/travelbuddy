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
  getHotellist,
  postHotel,
  getPlaces,
  viewTrip
} = require("../controller/tripplaner_controller");
const {
  getTrainlist,
  postTrainlist,
} = require("../controller/transportation_controller");

// GET
router.get("/dashboard", isLoggedIn, getDashboard);
router.get("/trip/edit/:id", getTrip);
router.get("/trip/edit/:id/trainlist", getTrainlist);
router.get("/trip/edit/:id/hotellist", getHotellist);

// POST
router.post("/trip", postTrip);
router.post("/trip/save-city", saveCity);
router.post("/trip/save-member", saveMembers);
router.post("/trip/edit/:id/trainlist", postTrainlist);
router.post("/trip/edit/:id/hotellist", postHotel);
router.get("/trip/edit/:id/places", getPlaces);
router.get("/trip/edit/:id/places/view",viewTrip);
module.exports = router;
