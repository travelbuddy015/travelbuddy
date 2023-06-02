const User = require("../models/user");
const Trip = require("../models/trip");

exports.index = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  var user = {
    name: "",
  };
  res.render("home", { user });
};
exports.logout = (req, res) => {
  req.logout(() => {});
  res.redirect("/");
};
