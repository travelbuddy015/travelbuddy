const passport = require("passport");
const User = require("../models/user");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var smtpConfig = {
  service: "gmail",
  // use SSL
  auth: { user: "medigo777@gmail.com", pass: "adfhbsdtrhgrsoqi" },
};

const transporter = nodemailer.createTransport(smtpConfig);

const generateVerificationToken = function (user) {

  const verificationToken = jwt.sign(
    { ID: user._id },
    "hakunnamata",
    { expiresIn: "7d" }
  );
  return verificationToken;
};
exports.getLogin = (req, res) => {
  if (req.isAuthenticated() && req.user.emailVerified == true) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  data.err = req.flash("error");
  res.render("login", data);
};

exports.getRegistration = (req, res) => {
  if (req.isAuthenticated() && req.user.emailVerified == true) {
    return res.redirect("/dashboard");
  }
  const data = {};
  data.user = req.user;
  res.render("register");
};

exports.postLogin = (req, res, next) => {
  
    passport.authenticate("userlocal", (err, user, info) => {
      if (!user ) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        if(user.emailVerified){
        return res.redirect("/dashboard");
        }else{
          req.flash("error", "email not verified");
          return res.redirect('/login');
        }
      });
    })(req, res, next);
   
  }

exports.postRegistration = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    name: req.body.name,
    phone: "",
    city: "",
    gender: "",
    age: 0,
    emailVerified: false,
  });
  newUser.name = capitalize(newUser.name);
  const verificationToken = generateVerificationToken(newUser);
  // console.log(verificationToken);
  const url = `http://localhost:3000/verify/${verificationToken}`;
  const mailOptions = {
    from: "medigo777@gmail.com",
    to: newUser.username,
    subject: "Verify Account",
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  };
  await transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("The email was sent successfully");
    }
  });


  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("userlocal")(req, res, () => {
      res.redirect("/login");
    });
  });

};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

exports.verifyUser = async (req, res, next) => {
  const token = req.params.token;
  // console.log(token);
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, "hakunnamata");
  } catch (err) {
    return res.status(500).send(err);
  }
  
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }
    // Step 3 - Update user verification status to true
    user.emailVerified = true;
    await user.save();
    return res.status(200).send({
      message: "Account Verified",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};