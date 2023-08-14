const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
  try {
    const con = await mongoose.connect(process.env.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected with database...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = db;
