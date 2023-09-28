const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  url: String,
  hotel_name: String,
  min_total_price: Number,
  longitude: Number,
  review_score: Number,
  main_photo_url: String,
  checkin: {
    from: String,
    until: String,
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = { Hotel, hotelSchema };
