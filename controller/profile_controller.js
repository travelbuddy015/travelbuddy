const User = require("../models/user");

exports.getProfile = (req, res, next) => {
  const user = req.user;
  res.render("profile", { user });
};

exports.updateProfile = async (req, res, next) => {
  let user;
  if (req.user.userType == "admin") {
    user = await User.findById(req.body.id);
  } else {
    user = req.user;
  }
  user.name = capitalize(req.body.name);
  user.phone = req.body.phone;
  user.age = req.body.age;
  user.gender = req.body.gender;
  user.city = req.body.city;
  user.save();
  res.redirect("/dashboard");
};
exports.getManageUser = (req, res, next) => {
  User.find({ userType: "user" }).then((user) => {
    res.render("manage_user", { user });
  });
};
exports.getUserDetails = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId).then((user) => {
    res.render("userDetails", { user });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => {
      res.redirect("/dashboard");
    })
    .catch((err) => {
      res.send(err);
    });
};
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
