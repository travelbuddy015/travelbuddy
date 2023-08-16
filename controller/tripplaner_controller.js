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
  console.log(req.body);
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

exports.getHotellist = async (req, res, next) => {
  var test;
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
    const dest_ids = await getDestid(trip.destination, options);
    // console.log(dest_ids);
    const url = `https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date=${arrival_date}&departure_date=${departure_date}&guest_qty=${adults}&dest_ids=${dest_ids}&room_qty=1&search_type=city&children_qty=${children_qty}&search_id=none&price_filter_currencycode=INR&order_by=popularity&languagecode=en-us&travel_purpose=leisure`;
    console.log(url);
    const response = await fetch(url, options);
    const data = await response.json();

    const hotelName = data.result.map((hotel) => hotel.url);
    res.render("hotelList", { user: req.user });
    console.log(hotelName);
  } catch (error) {
    console.error(error);
  }
};

async function getDestid(dest, options) {
  const url = `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${dest}&languagecode=en-us`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);
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
