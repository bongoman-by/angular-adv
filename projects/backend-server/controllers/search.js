const { response } = require("express");

const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

const search = async (req, res = response) => {
  const condition = req.params.condition || "";

  if (condition.length === 0) {
    return res.status(406).json({
      ok: false,
      msg: "Condition of search does not exist!",
    });
  }

  const regex = new RegExp(condition, "i");

  await Promise.all([
    User.find({ name: regex }),
    Doctor.find({ name: regex }),
    Hospital.find({ name: regex }),
  ])
    .then(([users, doctors, hospitals]) => {
      res.json({
        ok: true,
        users,
        doctors,
        hospitals,
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
  const regex = new RegExp(condition, "i");

  switch (type) {
    case "doctors":
      model = Doctor.find({ name: regex })
        .populate("user", ["name", "image"])
        .populate("hospital", ["name", "image"]);
      break;
    case "hospitals":
      model = Hospital.find({ name: regex }).populate("user", [
        "name",
        "image",
      ]);
      break;
    case "users":
      model = User.find({ name: regex });
      break;
    default:
      return res.status(400).json({
        ok: true,
        msg: "Type is not defined!",
      });
      break;
  }

  await model
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
