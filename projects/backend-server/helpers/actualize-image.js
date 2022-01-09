fs = require("fs");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

const actualizeImage = async (type, id, image, appDir) => {
  let model;
  let Model;

  switch (type) {
    case "doctors":
      model = await Doctor.findById(id);
      Model = Doctor;
      break;
    case "hospitals":
      model = await Hospital.findById(id);
      Model = Hospital;
      break;
    case "users":
      model = await User.findById(id);
      Model = User;
      break;
    default:
      return false;
      break;
  }

  if (!model) {
    return false;
  }

  const oldPath = `${appDir}/uploads/${type}/${model.image}`;
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
  await Model.findByIdAndUpdate(
    id,
    { image },
    {
      runValidators: true,
      context: "query",
    }
  );
  return true;
};

module.exports = { actualizeImage };
