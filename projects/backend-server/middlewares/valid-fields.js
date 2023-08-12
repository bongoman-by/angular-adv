const { validationResult } = require("express-validator");
const { response } = require("express");

const validFields = async (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const map = errors.mapped();
    const arr = errors.array();
    if (
      map.hasOwnProperty("oldPassword") &&
      map.oldPassword.value.length === 0 &&
      arr.length === 1
    ) {
    } else if (
      map.hasOwnProperty("oldPassword") &&
      map.hasOwnProperty("password") &&
      map.oldPassword.value.length === 0 &&
      arr.length === 2
    ) {
    } else {
      return res.status(400).json({ errors: map });
    }
  }

  next();
};

module.exports = { validFields };
