// controller/error_controller.js

// Handle 404 Not Found errors
exports.notFound = (req, res, next) => {
  res.status(404).render("error", { message: "Page not found" });
};

// Handle other errors
exports.handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(400).render("error", { message: "Section ID missing from URL" });
  // res.status(500).render("error", { message: "Something went wrong" });
};

exports;
