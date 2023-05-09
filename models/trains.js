const mongoose = require("mongoose");

const Trains = {
  train_number: { type: String, required: true },
  train_name: { type: String, required: true },
  run_days: { type: [String], required: true },
  train_src: { type: String, required: true },
  train_dstn: { type: String, required: true },
  from_std: { type: String, required: true },
  from_sta: { type: String, required: true },
  local_train_from_sta: { type: Number, required: true },
  to_sta: { type: String, required: true },
  to_std: { type: String, required: true },
  from_day: { type: Number, required: true },
  to_day: { type: Number, required: true },
  d_day: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  from_station_name: { type: String, required: true },
  to_station_name: { type: String, required: true },
  duration: { type: String, required: true },
  special_train: { type: Boolean, required: true },
  train_type: { type: String, required: true },
  train_date: { type: String, required: true },
  class_type: { type: [String], required: true },
};
const TrainSchema = new mongoose.Schema({
  status: { type: Boolean, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  data: [Trains],
});
const Train = mongoose.model("Train", TrainSchema);

module.exports = Train;
