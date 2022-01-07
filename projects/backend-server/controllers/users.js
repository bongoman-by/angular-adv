const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  users = await User.find();
  res.json({
    ok: true,
    length: users.length,
    users: users,
  });
};

const addUser = (req, res = response) => {
  const { password } = req.body;

  user = new User(req.body);

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  // Create a user based on the schema we created:
  User.create(user)
    .then(function (userDB) {
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
      } else {
        res.status(500).json(err.message);
      }
    });
};

const updateUser = (req, res = response) => {
  const id = req.params["id"];
  const { password, google, ...fields } = req.body;

  User.findByIdAndUpdate(id, fields, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then(function (user) {
      console.log("User updated!", user);
      res.json(user);
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

const deleteUser = (req, res = response) => {
  const id = req.params["id"];

  User.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        res.json({ ok: true, name: user.name, id: id, msg: "User deleted!" });
      } else {
        res.json({ ok: false, id: id, msg: "User no exists!" });
      }
    })
    .catch(function (err) {
      res.status(500).json(err.message);
    });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
