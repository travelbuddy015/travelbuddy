const express = require("express");
const router = express.Router();
const { index, logout } = require("../controller/index_controller");

router.get("/", index);
router.get("/logout", logout);

module.exports = router;
