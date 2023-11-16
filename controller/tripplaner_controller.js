const User = require("../models/user");
const Trip = require("../models/trip");
const fetch = require("node-fetch");
const helper = require("./helper");
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
    res.render("editable", {
      user: req.user,
      trip: trip,
      // places: filteredData,
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
