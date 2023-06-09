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
exports.postPlanning = function (req, res, next) {
  if(req.user.city==''){
    var source = 'Select';
  }else{
    source= req.user.city;
  }
  const trip = new Trip({
    source: source,
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
    res.redirect("/planning");
  });
 
};
exports.getPlaning= (req,res,next)=>{
  res.render("duration",{user:req.user});
  next();
}
