const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontend } = require("../helpers/menu-frontend");

const login = (req, res = response) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((userDB) => {
      if (!userDB) {
        return res.status(404).json({
          ok: false,
          msg: "Email is wrong!",
        });
      }
      if (!bcrypt.compareSync(password, userDB.password)) {
        return res.status(404).json({
          ok: false,
          msg: "Password is wrong!",
        });
      }

      generateJWT(userDB.id).then((token) => {
        res.json({
          ok: true,
          msg: `Welcome ${userDB.name}!`,
          token: token,
          menu: getMenuFrontend(userDB.role),
        });
      });
    })
    .catch(function (err) {
      if (err.name == "ValidationError") {
        res.status(422).json({
          ok: false,
          msg: err.message,
        });
      } else {
        res.status(500).json({
          ok: false,
          msg: err.message,
        });
      }
    });
};

const googleSignIn = async (req, res = response) => {
  const { token } = req.body;

  try {
    const { email, name, picture, sub } = await googleVerify(token);
    User.findOne({ email })
      .then((userDB) => {
        if (userDB) {
          User.findByIdAndUpdate(userDB.id, {
            name,
            password: sub,
            image: picture,
            google: true,
          })
            .then((userDB) => {
              generateJWT(userDB.id).then((token) => {
                res.json({
                  ok: true,
                  msg: `Welcome ${userDB.name}!`,
                  email: email,
                  token: token,
                  menu: getMenuFrontend(userDB.role),
                });
              });
            })
            .catch((err) => {
              res.status(500).json({
                ok: false,
                msg: err.message,
                token: token,
              });
            });
        } else {
          User.create({
            name,
            email,
            password: sub,
            image: picture,
            google: true,
          })
            .then((userDB) => {
              if (userDB) {
                generateJWT(userDB.id).then((token) => {
                  res.json({
                    ok: true,
                    msg: `Welcome ${userDB.name}!`,
                    token: token,
                    menu: getMenuFrontend(userDB.role),
                  });
                });
              }
            })
            .catch((err) => {
              res.status(500).json(err.message);
            });
        }
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  } catch (err) {
    if (err.name == "ValidationError") {
      return res.status(422).json(err.message);
    } else {
      return res.status(500).json(err.message);
    }
  }
};

const renewToken = (req, res = response) => {
  const id = req.uid;

  User.findById(id)
    .then((user) => {
      generateJWT(id)
        .then((token) => {
          res.json({
            ok: true,
            token,
            user,
            menu: getMenuFrontend(user.role),
          });
        })
        .catch((err) => {
          res.status(500).json({
            ok: false,
            msg: err.message,
          });
        });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.status(422).json({
          ok: false,
          msg: err.message,
        });
      } else {
        res.status(500).json({
          ok: false,
          msg: err.message,
        });
      }
    });
};

module.exports = { login, googleSignIn, renewToken };
