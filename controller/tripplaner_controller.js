const User = require("../models/user");
const Trip = require("../models/trip");
const fetch = require("node-fetch");
const helper = require("./helper");
const fs = require('fs');
exports.getDashboard = (req, res, next) => {
  User.findById(req.user._id)
    .populate("trips")
    .then((user) => {
      res.render("dashboard", { user: user });
    })
    .catch((err) => {
      console.error("Failed to retrieve user:", err);
      next(err);
    });
};
exports.postTrip = function (req, res, next) {
  const trip = new Trip({
    members: 0,
    destination: req.body.destination,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });

  trip.save().then((trip) => {
    // if (!req.user.trips) {
    //   req.user.trips = [];
    // }
    // req.user.trips.push(trip);
    // req.user.save();
    res.redirect(`/trip/edit/${trip._id}#city-shuffle`);
  });
};
exports.saveCity = (req, res, next) => {
  const tripID = req.body.id;
  const { sourceCity, returnCity } = req.body;
  Trip.findById(tripID)
    .then((trip) => {
      if (!trip) {
        throw new Error("Trip not found");
      }

      trip.source = sourceCity;
      trip.return_city = returnCity;
      return trip.save();
    })
    .then(() => {
      res.status(200).json({ message: "Trip updated successfully" });
    })
    .catch((err) => {
      console.error("Failed to update the trip:", err);
      res.status(500).json({ message: "Failed to update the trip" });
    });
};
exports.saveMembers = (req, res, next) => {
  const tripID = req.body.id;
  const { members, type, children, adults } = req.body;

  Trip.findById(tripID)
    .then((trip) => {
      if (!trip) {
        throw new Error("Trip not found");
      }
      if (adults > 0 && children > 0) {
        trip.members = adults;
        trip.children = children;
      }
      // if (!req.user.trips) {
      //   req.user.trips = [];
      // }
      // req.user.trips.push(trip);
      // req.user.save();
      else trip.members = members;
      return trip.save();
    })
    .then(() => {
      res.status(200).json({ message: "Trip updated successfully" });
    })
    .catch((err) => {
      console.error("Failed to update the trip:", err);
      res.status(500).json({ message: "Failed to update the trip" });
    });
};
exports.getTrip = (req, res, next) => {
  const tripID = req.params["id"];
  Trip.findById(tripID)
    .then((trip) => {
      res.render("planner", { user: req.user, trip: trip });
    })
    .catch((err) => {
      console.error("Failed to retrieve trip:", err);
      next(err);
    });
};

// tripadvisor
// exports.getHotellist = async (req, res, next) => {
//   const tripID = req.params["id"];
//   const options = {
//     method: "GET",
//     headers: {
//       "X-RapidAPI-Key": "63b212ad9amsh9b120867ebb5975p170920jsnb1ad06232ac3",
//       "X-RapidAPI-Host": "tripadvisor16.p.rapidapi.com",
//     },
//   };
//   try {
//     const trip = await Trip.findById(tripID);
//     const arrival_date = helper.formatDateToCustomFormat(trip.startdate);
//     const departure_date = helper.formatDateToCustomFormat(trip.enddate);
//     const adults = trip.members;
//     const children_qty = trip.children ? trip.children : 0;
//     // const dest_ids = await getDestid(trip.destination, options);
//     // console.log(dest_ids);
//     const url = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=297612&checkIn=${arrival_date}&checkOut=${departure_date}&pageNumber=1&currencyCode=INR`;
//     // console.log(url);
//     const response = await fetch(url, options);
//     const result = await response.json();

//     // const hotelName = data.result.map((hotel) => hotel.url);
//     const hotelNames = result.data.data.map((hotel) => hotel.title);
//     res.send(hotelNames);
//     // res.render("hotelList", { user: req.user, hotelNames: hotelNames });
//   } catch (error) {
//     console.error(error);
//   }
// };

// API BOOKING.COM

exports.getHotellist = async (req, res, next) => {
  const tripID = req.params["id"];
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "63b212ad9amsh9b120867ebb5975p170920jsnb1ad06232ac3",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };
  try {
    const trip = await Trip.findById(tripID);
    const arrival_date = helper.formatDateToCustomFormat(trip.startdate);
    const departure_date = helper.formatDateToCustomFormat(trip.enddate);
    const adults = trip.members;
    const children_qty = trip.children ? trip.children : 0;
    console.log(trip);
    const dest_ids = await getDestid(trip.destination, options);
    const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${arrival_date}&departure_date=${departure_date}&guest_qty=${adults}&dest_ids=${dest_ids}&room_qty=1&search_type=city&children_qty=${children_qty}&search_id=none&price_filter_currencycode=INR&order_by=popularity&languagecode=en-us&travel_purpose=leisure`;
    const response = await fetch(url, options);
    const data = await response.json();

    const hotels = data.result.map((hotel) => ({
      url: hotel.url,
      hotel_name: hotel.hotel_name,
      min_total_price: hotel.min_total_price,
      longitude: hotel.longitude,
      review_score: hotel.review_score,
      main_photo_url: hotel.main_photo_url.replace(
        "/square60/",
        "/max1024x768/"
      ),
      checkin: hotel.checkin,
    }));

    res.render("hotelList", { user: req.user, hotels: hotels });
  } catch (error) {
    console.error(error);
  }
};

async function getDestid(dest, options) {
  const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${dest}&languagecode=en-us`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const city = data.find(
      (city) =>
        city.city_name === dest[0] &&
        city.country === "India" &&
        city.dest_type === "city"
    );
    return city.dest_id;
  } catch (error) {
    console.error(error);
  }
}

exports.postHotel = (req, res, next) => {
  const tripId = req.params.id;
  const hotelData = {
    url: req.body.hotelUrl[0],
    min_total_price: req.body.hotelMinTotalPrice,
    hotel_name: req.body.hotelName,
    main_photo_url: req.body.hotelMainPhotoUrl,
    checkin: req.body.hotelCheckIn,
  };

  Trip.findById(tripId)
    .then((trip) => {
      trip.hotel = hotelData;
      return trip.save();
    })
    .then((savedTrip) => {
      res.redirect(`/trip/edit/${savedTrip._id}/places`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
exports.viewTrip = async (req, res, next) =>{
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId);
    const places_data = trip.places;
// Read the contents of temp.txt
  var time = timeToFloat(trip.StoD_train.to_std + ':00');
  if(time < 11){
    time=11;
  }

    res.render("editable", {
      user: req.user,
      trip: trip,
      places: places_data,
      trip_time : time
      
    });
  } catch (error) {
    console.log("error", error);
  }
}
exports.getPlaces = async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId);
    const requestOptions = {
      method: "GET",
    };

    // const place = await getPlaceDetails(req, res, trip.destination);
    // const response = await fetch(
    //   `https://api.geoapify.com/v2/places?categories=tourism.attraction,entertainment&filter=circle:${place.lon},${place.lat},20000&bias=proximity:${place.lon},${place.lat}&limit=20&apiKey=4586f907a0144e8d9db4ff9ccd2ff555`,
    //   requestOptions
    // );
    // const result = await response.json();
    // const filteredData = result.features.filter(
    //   (feature) =>
    //     !feature.properties.categories.includes("entertainment.cinema")
    // );

    // res.send(filteredData);
    // console.log(filteredData);
    
var  dummydata = [
  {
    type: 'Feature',
    properties: {
      name: 'ARISTRON INSTRUMENTION',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395006',
      suburb: 'Hirabag',
      street: 'Varachha Road',
      lon: 72.8445614,
      lat: 21.2098332,
      state_code: 'GJ',
      formatted: 'ARISTRON INSTRUMENTION, Varachha Road, Hirabag, - 395006, Gujarat, India',
      address_line1: 'ARISTRON INSTRUMENTION',
      address_line2: 'Varachha Road, Hirabag, - 395006, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 1335,
      place_id: '51b21d424b0d36524059885deda0b7353540f00103f9012f515217010000009203164152495354524f4e20494e535452554d454e54494f4e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Vasanjipark',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Katargam Taluka',
      city: 'Surat',
      postcode: '395004',
      street: 'Laxmikant Ashram Road',
      housenumber: '32',
      lon: 72.8299567,
      lat: 21.2267483,
      state_code: 'GJ',
      formatted: 'Vasanjipark, 32, Laxmikant Ashram Road, Surat - 395004, Gujarat, India',
      address_line1: 'Vasanjipark',
      address_line2: '32, Laxmikant Ashram Road, Surat - 395004, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 1920,
      place_id: '5126e6b4021e35524059c3ac362d0c3a3540f00103f901468ddc0d0100000092030b566173616e6a697061726b'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'SHREENIKETAN',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Katargam Taluka',
      postcode: '395006',
      suburb: 'Hirabag',
      street: 'Varachha Road',
      housenumber: 'C-15/16',
      lon: 72.8556562,
      lat: 21.2127026,
      state_code: 'GJ',
      formatted: 'SHREENIKETAN, C-15/16, Varachha Road, Hirabag, - 395006, Gujarat, India',
      address_line1: 'SHREENIKETAN',
      address_line2: 'C-15/16, Varachha Road, Hirabag, - 395006, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 2512,
      place_id: '51a8e73812c336524059548678ad73363540f00103f901c51ecb0d0100000092030c53485245454e494b4554414e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      county: 'Surat District',
      city: 'Surat',
      postcode: '395001',
      street: 'Nanapura main Road',
      lon: 72.8177756,
      lat: 21.1900458,
      state_code: 'GJ',
      formatted: 'Nanapura main Road, Surat - 395001, Gujarat, India',
      address_line1: 'Nanapura main Road',
      address_line2: 'Surat - 395001, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 2594,
      place_id: '51e05d786f5634524059d07d71d7a6303540f00103f9010d17760301000000'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Gandhi Smruti Hall',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Katargam Taluka',
      city: 'Surat',
      postcode: '395001',
      street: 'Leading to post office',
      lon: 72.8140219,
      lat: 21.1857981,
      state_code: 'GJ',
      formatted: 'Gandhi Smruti Hall, Leading to post office, Surat - 395001, Gujarat, India',
      address_line1: 'Gandhi Smruti Hall',
      address_line2: 'Leading to post office, Surat - 395001, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 3202,
      place_id: '5194ae4fef183452405974e8dc76902f3540f00103f901403daf490000000092031247616e64686920536d727574692048616c6c'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'આનંદ નગય સોસાયટી હૉલ.',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395006',
      suburb: 'Hirabag',
      street: 'Varachha Road',
      lon: 72.8624299,
      lat: 21.2189173,
      state_code: 'GJ',
      formatted: 'આનંદ નગય સોસાયટી હૉલ., Varachha Road, Hirabag, - 395006, Gujarat, India',
      address_line1: 'આનંદ નગય સોસાયટી હૉલ.',
      address_line2: 'Varachha Road, Hirabag, - 395006, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 3356,
      place_id: '51ece52d0d32375240598ec7d5f60a383540f00103f901ea22f8a401000000920337e0aa86e0aaa8e0aa82e0aaa620e0aaa8e0aa97e0aaaf20e0aab8e0ab8be0aab8e0aabee0aaafe0aa9fe0ab8020e0aab9e0ab89e0aab22e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: "Surat City's First Firetruck from the 19th century",
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Chorasi Taluka',
      city: 'Surat',
      postcode: '395007',
      street: 'Athwalines Road',
      lon: 72.8067117,
      lat: 21.1853907,
      state_code: 'GJ',
      formatted: "Surat City's First Firetruck from the 19th century, Athwalines Road, Surat - 395007, Gujarat, India",
      address_line1: "Surat City's First Firetruck from the 19th century",
      address_line2: 'Athwalines Road, Surat - 395007, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 3722,
      place_id: '513c331c2aa1335240594a3bd3c3752f3540f00103f9013f118b19010000009203325375726174204369747927732046697273742046697265747275636b2066726f6d2074686520313974682063656e74757279'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Kabutar Circle',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Udhna Taluka',
      postcode: '395010',
      street: 'Canal Corridor',
      lon: 72.8607419,
      lat: 21.1890476,
      state_code: 'GJ',
      formatted: 'Kabutar Circle, Canal Corridor, - 395010, Gujarat, India',
      address_line1: 'Kabutar Circle',
      address_line2: 'Canal Corridor, - 395010, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 3770,
      place_id: '5100b331651637524059f4226d6c65303540f00103f9016ecb7d920200000092030e4b61627574617220436972636c65'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Amazia',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395010',
      street: 'Canal Corridor',
      lon: 72.8649911,
      lat: 21.1945564,
      state_code: 'GJ',
      formatted: 'Amazia, Canal Corridor, - 395010, Gujarat, India',
      address_line1: 'Amazia',
      address_line2: 'Canal Corridor, - 395010, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 3831,
      place_id: '513075a1035c3752405920fac072ce313540f00103f901cf08154c01000000920306416d617a6961'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'La Citadel',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395010',
      street: 'Valthan road',
      lon: 72.8687796,
      lat: 21.1910688,
      state_code: 'GJ',
      formatted: 'La Citadel, Valthan road, - 395010, Gujarat, India',
      address_line1: 'La Citadel',
      address_line2: 'Valthan road, - 395010, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 4356,
      place_id: '51a55bc0159a375240590a0989e2e9303540f00103f9011dd07d920200000092030a4c61204369746164656c'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Magic heart dj',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395006',
      suburb: 'Hirabag',
      street: 'Varachha Road',
      lon: 72.8750798,
      lat: 21.2196919,
      state_code: 'GJ',
      formatted: 'Magic heart dj, Varachha Road, Hirabag, - 395006, Gujarat, India',
      address_line1: 'Magic heart dj',
      address_line2: 'Varachha Road, Hirabag, - 395006, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 4643,
      place_id: '51f998b44e01385240596c7277ba3d383540f00103f90144c9f6010100000092030e4d6167696320686561727420646a'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'botonical garden',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Chorasi Taluka',
      postcode: '395005',
      street: 'Dandi Road',
      lon: 72.78846524017094,
      lat: 21.2257616,
      state_code: 'GJ',
      formatted: 'botonical garden, Dandi Road, - 395005, Gujarat, India',
      address_line1: 'botonical garden',
      address_line2: 'Dandi Road, - 395005, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 4786,
      place_id: '51c5722a557632524059b1c72015c6393540f00102f901da65011800000000920310626f746f6e6963616c2067617264656e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'SMC Garden',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395010',
      street: 'Valthan road',
      lon: 72.8776594,
      lat: 21.1910815,
      state_code: 'GJ',
      formatted: 'SMC Garden, Valthan road, - 395010, Gujarat, India',
      address_line1: 'SMC Garden',
      address_line2: 'Valthan road, - 395010, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 5188,
      place_id: '51ba0155922b38524059b51e9bb7ea303540f00103f9016f807d920200000092030a534d432047617264656e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'SMC Garden',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      state_district: 'Surat District',
      county: 'Puna Taluka',
      postcode: '395010',
      street: 'Valthan road',
      lon: 72.8777347,
      lat: 21.1910773,
      state_code: 'GJ',
      formatted: 'SMC Garden, Valthan road, - 395010, Gujarat, India',
      address_line1: 'SMC Garden',
      address_line2: 'Valthan road, - 395010, Gujarat, India',
      categories: [Array],
      details: [],
      datasource: [Object],
      distance: 5196,
      place_id: '511fc429ce2c38524059e3412471ea303540f00103f9016e807d920200000092030a534d432047617264656e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Jahangirpura SMC Garden',
      country: 'India',
      country_code: 'in',
      state: 'Gujarat',
      county: 'Surat District',
      city: 'Surat',
      postcode: '395005',
      street: 'SH6',
      lon: 72.78818966938046,
      lat: 21.23455155,
      state_code: 'GJ',
      formatted: 'Jahangirpura SMC Garden, SH6, Surat - 395005, Gujarat, India',
      address_line1: 'Jahangirpura SMC Garden',
      address_line2: 'SH6, Surat - 395005, Gujarat, India',
      categories: [Array],
      details: [Array],
      datasource: [Object],
      distance: 5244,
      place_id: '5159df5caf713252405994685429093c3540f00102f90187301618000000009203174a6168616e6769727075726120534d432047617264656e'
    },
    geometry: { type: 'Point', coordinates: [Array] }
  }
]
trip.places = dummydata;
trip.save();
// Read the contents of temp.txt
  var time = timeToFloat(trip.StoD_train.to_std + ':00');
  if(time < 11){
    time=11;
  }

    res.render("editable", {
      user: req.user,
      trip: trip,
      places: dummydata,
      trip_time : time
      
    });
  } catch (error) {
    console.log("error", error);
  }
};

// https://api.geoapify.com/v2/places?categories=tourism.attraction,entertainment&filter=place:512fb9f6aa3a355240597edd8e15a1353540f00103f901e31fd45502000000c002079203055375726174&limit=20&apiKey=YOUR_API_KEY
// place id
// https://api.geoapify.com/v1/geocode/search?text=surat&format=json&apiKey=4586f907a0144e8d9db4ff9ccd2ff555
getPlaceDetails = async (req, res, placeName) => {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${placeName}&format=json&apiKey=4586f907a0144e8d9db4ff9ccd2ff555`,
      { method: "GET" }
    );
    const result = await response.json();
    const indiaRes = result.results.filter(
      (place) => place.country_code === "in"
    );
    if (indiaRes.length > 0) {
      const firstPlace = indiaRes[0];
      const { lon, lat, name, place_id } = firstPlace;
      const finalPlace = { lon, lat, name, place_id };
      return finalPlace;
    }
  } catch (error) {
    console.log("error", error);
  }
};

function timeToFloat(timeString) {
  // Parse the time string into a Date object
  const parsedTime = new Date(`1970-01-01T${timeString}Z`);
  
  
  // Calculate the number of seconds since midnight
  const floatTime = Math.ceil(parsedTime.getUTCHours()  + parsedTime.getUTCMinutes()/60) ;

  // Convert seconds to fraction of a day
  

  return floatTime;
}