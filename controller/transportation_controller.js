const User = require("../models/user");
const Trip = require("../models/trip");
const Train = require("../models/trains");
const Station = require("../models/stations");
exports.getTrainlist = (req, res, next) => {
  const tripId = req.params.id;
  let startdate, enddate;
  Trip.findById(tripId)
    .then((trip) => {
      if (!req.user.trips) {
        req.user.trips = [];
      }
      if (!req.user.trips.includes(tripId)) {
        req.user.trips.push(trip);
        req.user.save();
      }
      const source = trip.source.toUpperCase();
      const destination = trip.destination[0].toUpperCase();
      startdate = formatDateToCustomFormat(trip.startdate);
      enddate = formatDateToCustomFormat(trip.enddate);
      return Promise.all([getstationname(source), getstationname(destination)]);
    })
    .then(([source_station, destination_station]) => {
      Train.find({
        from: source_station,
        to: destination_station,
      }).then((train) => {
        console.log(train);
        res.render("trainlist", {
          startdate: startdate,
          enddate: enddate,
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
    console.log(s[0]);
    return s[0].code;
  });
};
function formatDateToCustomFormat(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
