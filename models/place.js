const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  type: String,
  properties: {
    name: String,
    country: String,
    country_code: String,
    state: String,
    state_district: String,
    county: String,
    city: String,
    postcode: String,
    suburb: String,
    street: String,
    lon: Number,
    lat: Number,
    state_code: String,
    formatted: String,
    address_line1: String,
    address_line2: String,
    categories: [String],
    details: [String],
  },
  datasource: {
    sourcename: String,
    attribution: String,
    license: String,
    url: String,
  },
  distance : Number,
  placeid: String,
  geometry: {
    type: { type: String },
    coordinates: { type: [String] }
  },
});

const place = mongoose.model('place', placeSchema);

module.exports = {place,placeSchema};