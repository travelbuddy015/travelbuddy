exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === "admin") {
    return next();
  }
  return res.redirect("back");
};
