const mongoose = require("mongoose");

const Trains = {
  train_number: { type: String },
  train_name: { type: String },
  run_days: { type: [String] },
  train_src: { type: String },
  train_dstn: { type: String },
  from_std: { type: String },
  from_sta: { type: String },
  local_train_from_sta: { type: Number },
  to_sta: { type: String },
  to_std: { type: String },
  from_day: { type: Number },
  to_day: { type: Number },
  d_day: { type: Number },
  from: { type: String },
  to: { type: String },
  from_station_name: { type: String },
  to_station_name: { type: String },
  duration: { type: String },
  special_train: { type: Boolean },
  train_type: { type: String },
  train_date: { type: String },
  class_type: { type: [String] },
};
const Train = mongoose.model("Train", Trains);

module.exports = { Trains, Train };
