const mongoose = require("mongoose");
const Train = require("./trains").Trains;
const User = require("./user");
const TripSchema = new mongoose.Schema({
  source: { type: String },
  return_city: { type: String },
  destination: [{ type: String }],
  startdate: { type: Date, required: true },
  enddate: { type: Date, required: true },
  rating: { type: Number },
  members: { type: Number, required: true },
  children: { type: Number },
  // children: { type: Number },
  // triptype: { type: String },
  // StoD_train: { type: Train },
  // DtoS_train: { type: Train },
  // places : [{type: Place}],
  // resturant: {type: Resturant},
  // hotel: {type: Hotel},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;
