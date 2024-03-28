const User = require("../models/user");
const Trip = require("../models/trip");
const fetch = require("node-fetch");
const Train = require("../models/trains").Train;
const Station = require("../models/stations");
const { formatDateToCustomFormat } = require("./helper");
const { json } = require("body-parser");
require("dotenv").config();

exports.getTrainlist = async (req, res, next) => {
  const tripId = req.params.id;
  let startdate, enddate;
  try {
    const trip = await Trip.findById(tripId);

    if (!req.user.trips) {
      req.user.trips = [];
    }

    if (!req.user.trips.includes(tripId)) {
      req.user.trips.push(trip);
      await req.user.save();
    }

    const source = trip.source.toUpperCase();
    const destination = trip.destination[0].toUpperCase();
    startdate = formatDateToCustomFormat(trip.startdate);
    enddate = formatDateToCustomFormat(trip.enddate);

    const [source_station, destination_station] = await Promise.all([
      getstationname(source),
      getstationname(destination),
    ]);

    const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${source_station}&toStationCode=${destination_station}&dateOfJourney=${startdate}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.irctc_api_key,
        "X-RapidAPI-Host": "irctc1.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    const trainList = result.data;

    if (req.query.search === undefined) {
      res.render("trainlist", {
        startdate: startdate,
        enddate: enddate,
        user: req.user,
        trains: trainList,
        source: source_station,
        destination: destination_station,
      });
    } else {
      var search_input = req.query.search;
      var tokens = search_input.split(" ").filter(function (token) {
        return token.trim() !== "";
      });

      if (tokens.length) {
        var searchTermRegex = new RegExp(tokens.join("|"), "gim");
        console.log(searchTermRegex);

        var filteredList = trainList.filter(function (train) {
          var trainString = "";
          for (var key in train) {
            if (train[key] !== "" && train[key] !== undefined) {
              trainString += train[key].toString().trim() + " ";
            }
          }

          return trainString.match(searchTermRegex);
        });

        res.render("trainlist", {
          search_input: search_input,
          startdate: startdate,
          enddate: enddate,
          user: req.user,
          trains: filteredList,
          source: source_station,
          destination: destination_station,
        });
      }
    }
  } catch (error) {
    console.error(error);

    res.status(500).send("An error occurred");
  }
};

exports.postTrainlist = (req, res, next) => {
  var train_number = req.body.trainNumber;
  var train_name = req.body.trainName;
  var duration = req.body.duration;
  var from_std = req.body.startTime;
  var to_std = req.body.endTime;
  const trainObjStr = JSON.stringify({
    train_name,
    train_number,
    duration,
    from_std,
    to_std,
  });
  const trainObj = JSON.parse(trainObjStr);
  Trip.findById(req.params.id).then((trip) => {
    console.log(trainObj);
    trip.StoD_train = trainObj;
    trip.save();
    res.redirect("hotellist");
  });
};
const getstationname = (name) => {
  const regex = new RegExp(name + "\\s", "i");
  return Station.find({
    $or: [{ name: regex }, { name: name }],
  }).then((s) => {
    return s[0].code;
  });
};
