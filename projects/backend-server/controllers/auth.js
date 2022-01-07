const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const login = (req, res = response) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(function (userDB) {
      if (!userDB) {
        return res.status(404).json({
          ok: false,
          msg: "Email is wrong",
        });
      }
      if (!bcrypt.compareSync(password, userDB.password)) {
        return res.status(404).json({
          ok: false,
          msg: "Password is wrong",
        });
      }

      generateJWT(userDB.id).then((token) => {
        res.json({
          ok: true,
          msg: `Welcome ${userDB.name}!`,
          token: token,
        });
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

module.exports = { login };
