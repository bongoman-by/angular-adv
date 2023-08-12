const { response } = require("express");
const Hospital = require("../models/hospital");

const getHospitals = async (req, res) => {
  const from = +req.query.from || 0;
  const limit = +req.query.limit || 3;
  const [hospitals, total] = await Promise.all([
    Hospital.find().populate("user", ["name", "image"]).skip(from).limit(limit),
    Hospital.count(),
  ]);
  res.json({
    ok: true,
    length: hospitals.length,
    hospitals,
    total,
  });
};

const addHospital = (req, res = response) => {
  const hospital = new Hospital({ ...req.body, user: req.uid });

  Hospital.create(hospital)
    .then((hospitalDB) => {
      res.json({
        ok: true,
        msg: `Add new hospital ${hospitalDB.name}!`,
      });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.status(422).json(err.message);
      } else {
        res.status(500).json(err.message);
      }
    });
};

const updateHospital = (req, res = response) => {
  const id = req.params["id"];
  const { ...fields } = req.body;

  Hospital.findByIdAndUpdate(id, fields, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((hospital) => {
      res.json({
        ok: true,
        msg: `Update hospital ${hospital.name}!`,
      });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.status(422).json(err.message);
      } else {
        res.status(500).json(err.message);
      }
    });
};

const deleteHospital = (req, res = response) => {
  const id = req.params["id"];

  Hospital.findByIdAndDelete(id)
    .then((hospital) => {
      if (hospital) {
        res.json({
          ok: true,
          name: Hospital.name,
          id: id,
          msg: "Hospital deleted!",
        });
      } else {
        res.json({ ok: false, id: id, msg: "Hospital does not exist!" });
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};

module.exports = { getHospitals, addHospital, updateHospital, deleteHospital };
