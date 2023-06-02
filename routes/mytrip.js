const express = require("express");
const router = express.Router();
const { getTrip, deleteTrip } = require("../controller/mytrip_controller");
router.get("/mytrip", getTrip);
router.get("/deletetrip/:id", deleteTrip);
module.exports = router;
