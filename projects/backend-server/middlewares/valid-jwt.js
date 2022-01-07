const jwt = require("jsonwebtoken");
const { response, request } = require("express");

const validJWT = async (req = request, res = response, next) => {
  const token = req.get("x-token");
  if (!token) {
    return res.json({
      ok: false,
      msg: "Token does not exist!",
    });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(422).json({
          ok: false,
          msg: err.message,
        });
      } else {
        console.log(decoded);
        next();
      }
    });
  } catch (err) {
    res.status(401).json({
      ok: false,
      msg: err.message,
    });
  }
};

module.exports = { validJWT };
