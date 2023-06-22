const User = require("../models/user");
const Trip = require("../models/trip");

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
