const mongoose = require("mongoose");

const Stations = {
  name: { type: String, required: true },
  code: { type: String, required: true },
};
const Station = mongoose.model("Station", Stations);

module.exports = Station;
