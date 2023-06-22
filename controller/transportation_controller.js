const User = require("../models/user");
const Trip = require("../models/trip");
const Train = require("../models/trains");
const Station = require("../models/stations");
exports.getTrainlist = (req, res, next) => {
  const tripId = req.params.id;
  Trip.findById(tripId)
    .then((trip) => {
      const source = trip.source.toUpperCase();
      const destination = trip.destination[0].toUpperCase();
      return Promise.all([getstationname(source), getstationname(destination)]);
    })
    .then(([source_station, destination_station]) => {
      console.log(source_station);
      console.log(destination_station);
      Train.find({
        from: source_station,
        to: destination_station,
      })
        .then((train) => {
          // res.send(train);
          res.render("trainlist", { user: req.user, trains: train });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error retrieving train with id " + req.params.id,
          });
        });
    });
};
const getstationname = (name) => {
  const regex = new RegExp(name + "\\s", "i");
  return Station.find({
    $or: [{ name: regex }, { name: name }],
  }).then((s) => {
    return s[0].code;
  });
};
