const express = require("express");
const router = express.Router();
const { getTrip, deleteTrip } = require("../controller/mytrip_controller");
router.get("/mytrip", getTrip);
router.delete("/deletetrip/:id", deleteTrip);
module.exports = router;
