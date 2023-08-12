const { response } = require("express");
const Doctor = require("../models/doctor");

const getDoctors = async (req, res) => {
  const from = +req.query.from || 0;
  const limit = +req.query.limit || 3;
  const [doctors, total] = await Promise.all([
    Doctor.find()
      .populate("user", ["name", "image"])
      .populate("hospital", ["name", "image"])
      .skip(from)
      .limit(limit),
    Doctor.count(),
  ]);
  res.json({
    ok: true,
    length: doctors.length,
    doctors,
    total,
  });
};

const getDoctor = async (req, res = response) => {
  const id = req.params["id"];

  await Doctor.findById(id)
    .populate("user", ["name", "image"])
    .populate("hospital", ["name", "image"])
    .then((doctor) => {
      if (doctor) {
        res.json({
          ok: true,
          doctor,
          msg: `Doctor ${doctor.name} found!`,
        });
      } else {
        res.json({ ok: false, id: id, msg: "Doctor does not exist!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    });
};

const addDoctor = (req, res = response) => {
  const doctor = new Doctor({ ...req.body, user: req.uid });
  Doctor.create(doctor)
    .then(function (doctorDB) {
      res.json({
        ok: true,
        msg: `Add new doctor ${doctorDB.name}!`,
        doctor: doctorDB,
      });
    })
    .catch(function (err) {
      if (err.name == "ValidationError") {
        console.error("Error Validating!", err.message);
        res.status(422).json(err.message);
      } else {
        res.status(500).json(err.message);
      }
    });
};

const updateDoctor = (req, res = response) => {
  const id = req.params["id"];
  const { ...fields } = req.body;

  Doctor.findById(id)
    .then((doctorDB) => {
      if (doctorDB) {
        const hospitals = doctorDB.hospital;
        if (!hospitals.includes(fields.hospital)) {
          hospitals.push(fields.hospital);
        }
        fields.hospital = hospitals;
        Doctor.findByIdAndUpdate(id, fields, {
          new: true,
          runValidators: true,
          context: "query",
        })
          .then((doctor) => {
            res.json({
              ok: true,
              msg: `Update doctor ${doctor.name}!`,
              doctor: doctor,
            });
          })
          .catch((err) => {
            res.status(500).json(err.message);
          });
      }
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.status(422).json(err.message);
      } else {
        res.status(500).json(err.message);
      }
    });
};

const deleteDoctor = (req, res = response) => {
  const id = req.params["id"];

  Doctor.findByIdAndDelete(id)
    .then((doctor) => {
      if (doctor) {
        res.json({
          ok: true,
          name: doctor.name,
          id: id,
          msg: "Doctor deleted!",
        });
      } else {
        res.json({ ok: false, id: id, msg: "Doctor does not exist!" });
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};

module.exports = {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctor,
};
