const User = require("../models/user");
const Trip = require("../models/trip");

exports.getDashboard = (req, res, next) => {
  User.findById(req.user._id)
    .populate("trips")
    .then((user) => {
      res.render("dashboard", { user: user });
      console.log(user);
    })
    .catch((err) => {
      console.error("Failed to retrieve user:", err);
      next(err);
    });
};
exports.postPlanning = function (req, res, next) {
  const trip = new Trip({
    source: "Test",
    destination: req.body.destination,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });

  trip.save().then((trip) => {
    if (!req.user.trips) {
      req.user.trips = [];
    }
    req.user.trips.push(trip);
    req.user.save();
    res.redirect("/dashboard");
  });
};
