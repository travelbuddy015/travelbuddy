const User = require("../models/user");
const Trip = require("../models/trip");
exports.getTrip = (req, res, next) => {
  User.findById(req.user._id)
    .populate("trips")
    .then((user) => {
      res.render("mytrip", { user: user });
    })
    .catch((err) => {
      console.error("Failed to retrieve user:", err);
      next(err);
    });
};
exports.deleteTrip = (req, res) => {
  const user = req.user;
  Trip.findByIdAndDelete(req.params.id)
    .then((trip) => {
      const index = user.trips.indexOf(req.params.id);
      if (index > -1) {
        user.trips.splice(index, 1);
      }
      user.save().then(() => {
        res.json({ success: true }); // Return JSON response
      });
    })
    .catch((err) => {
      console.error("Error deleting trip:", err);
      res.status(500).json({ success: false, error: "Failed to delete trip" });
    });
};
