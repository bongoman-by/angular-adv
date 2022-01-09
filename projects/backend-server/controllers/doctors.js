const { response } = require("express");
const Doctor = require("../models/doctor");

const getDoctors = async (req, res) => {
  const doctors = await Doctor.find()
    .populate("user", "name")
    .populate("hospital", "name");
  res.json({
    ok: true,
    length: doctors.length,
    doctors: doctors,
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

  Doctor.findByIdAndUpdate(id, fields, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then(function (doctor) {
      console.log("Doctor updated!", doctor);
      res.json(doctor);
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
    .catch(function (err) {
      res.status(500).json(err.message);
    });
};

module.exports = { getDoctors, addDoctor, updateDoctor, deleteDoctor };
