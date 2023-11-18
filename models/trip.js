const mongoose = require("mongoose");
const Train = require("./trains").Trains;
const User = require("./user");
const Hotel = require("./hotel").hotelSchema;
const Place = require("./place").placeSchema;
const TripSchema = new mongoose.Schema({
  source: { type: String },
  return_city: { type: String },
  destination: [{ type: String }],
  startdate: { type: Date, required: true },
  enddate: { type: Date, required: true },
  rating: { type: Number },
  members: { type: Number, required: true },
  children: { type: Number },
  StoD_train: { type: Train },
  hotel: { type: Hotel },
  // triptype: { type: String },
  // DtoS_train: { type: Train },
  places : [{type: Place}],
  // resturant: {type: Resturant},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Trip = mongoose.model("Trip", TripSchema);

module.exports = Trip;
