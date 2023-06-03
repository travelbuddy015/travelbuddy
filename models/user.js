const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Trip = require("./trip").Trip;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  ],
  phone: {
    type: String,
  },
  gender:{type:String},
  age:{type:Number},
  city:{type:String},
  
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
