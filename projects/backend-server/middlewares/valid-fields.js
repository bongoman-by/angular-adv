const { validationResult } = require("express-validator");
const { response } = require("express");

const validFields = async (req, res = response, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  next();
};

module.exports = { validFields };
