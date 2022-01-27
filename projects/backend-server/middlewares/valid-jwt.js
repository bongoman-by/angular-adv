const jwt = require("jsonwebtoken");
const { response, request } = require("express");
const User = require("../models/user");

const validJWT = async (req = request, res = response, next) => {
  const token = req.get("x-token");
  if (!token) {
    return res.status(401).json({
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
        req.uid = decoded.id;
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

const validADMIN_ROLE = async (req = request, res = response, next) => {
  const tokenId = req.uid;
  const userId = req.params["id"];
  if (userId === tokenId && req.method === "PUT") {
    return next();
  }
  try {
    await User.findById(tokenId).then((user) => {
      if (user && user.role === "ADMIN_ROLE") {
        next();
      } else {
        res.status(400).json({
          ok: false,
          msg: "You don't have got admin's rights!",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: err.message,
    });
  }
};

module.exports = { validJWT, validADMIN_ROLE };
