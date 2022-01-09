const { response } = require("express");

const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

const search = async (req, res = response) => {
  const condition = req.params.condition || "";

  if (condition.length === 0) {
    return res.json({
      ok: true,
      msg: "Condition of search does not exist!",
    });
  }

  const regex = new RegExp(condition, "i");

  await Promise.all([
    User.find({ name: regex }),
    Hospital.find({ name: regex }),
    Doctor.find({ name: regex }),
  ])
    .then((users, hospitals, doctors) => {
      res.json({
        ok: true,
        users: users,
        hospitals: hospitals,
        doctors: doctors,
      });
    })
    .catch(function (err) {
      if (err.name == "ValidationError") {
        console.error("Error Validating!", err.message);
        res.status(422).json(err.message);
      }
      res.status(500).json(err.message);
    });
};

const getDocsCollection = async (req, res = response) => {
  const condition = req.params.condition || "";
  const type = req.params.type || "";

  if (condition.length === 0) {
    return res.status(400).json({
      ok: true,
      msg: "Condition of search does not exist!",
    });
  }

  let model;

  switch (type) {
    case "doctors":
      model = Doctor;
      break;
    case "hospitals":
      model = Hospital;
      break;
    case "users":
      model = User;
      break;
    default:
      return res.status(400).json({
        ok: true,
        msg: "Type is not defined!",
      });
      break;
  }

  const regex = new RegExp(condition, "i");

  await model
    .find({ name: regex })
    .then((searchResult) => {
      res.json({
        ok: true,
        type,
        searchResult,
      });
    })
    .catch(function (err) {
      if (err.name == "ValidationError") {
        console.error("Error Validating!", err.message);
        res.status(422).json(err.message);
      }
      res.status(500).json(err.message);
    });
};

module.exports = { search, getDocsCollection };
