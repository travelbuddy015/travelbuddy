const User = require("../models/user");
const Trip = require("../models/trip");
const Train = require("../models/trains");
const Station = require("../models/stations");
exports.getTrainlist = (req, res, next) => {
  const tripId = req.params.id;
  Trip.findById(tripId)
    .then((trip) => {
      if (!req.user.trips) {
        req.user.trips = [];
      }
      req.user.trips.push(trip);
      req.user.save();
      const source = trip.source.toUpperCase();
      const destination = trip.destination[0].toUpperCase();
      return Promise.all([getstationname(source), getstationname(destination)]);
    })
    .then(([source_station, destination_station]) => {
      // console.log(source_station);
      // console.log(destination_station);
      Train.find({
        from: source_station,
        to: destination_station,
      }).then((train) => {
        res.render("trainlist", {
          user: req.user,
          trains: train,
          source: source_station,
          destination: destination_station,
        });
      });
    });
};
const getstationname = (name) => {
  const regex = new RegExp(name + "\\s", "i");
  return Station.find({
    $or: [{ name: regex }, { name: name }],
  }).then((s) => {
    // console.log(s[0].code);
    return s[0].code;
  });
};
