const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  const from = +req.query.from || 0;
  const limit = +req.query.limit || 5;
  const [users, total] = await Promise.all([
    User.find().skip(from).limit(limit),
    User.count(),
  ]);

  res.json({
    ok: true,
    length: users.length,
    total: total,
    users: users,
  });
};

const addUser = async (req, res = response) => {
  const { password } = req.body;

  user = new User(req.body);

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  // Create a user based on the schema we created:
  await User.create(user)
    .then((userDB) => {
      generateJWT(userDB.id).then((token) => {
        res.json({
          ok: true,
          msg: `Welcome ${userDB.name}!`,
          token: token,
        });
      });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        console.error("Error Validating!", err.message);
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

const updateUser = (req, res = response) => {
  const id = req.params["id"];
  const { oldPassword, password, google, ...fields } = req.body;
  let newPassword = "";
  if (oldPassword.length > 0) {
    const salt = bcrypt.genSaltSync(10);
    newPassword = bcrypt.hashSync(password || "", salt);
  }
  User.findById(id).then((user) => {
    if (oldPassword.length > 0) {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(404).json({
          ok: false,
          msg: "Password is wrong!",
        });
      }
    } else {
      newPassword = user.password;
    }
    if (fields.email !== user.email && user.google) {
      return res.status(404).json({
        ok: false,
        msg: "Can not change google email!",
      });
    }
    User.findByIdAndUpdate(
      id,
      { ...fields, password: newPassword },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )
      .then((user) => {
        res.json({
          ok: true,
          msg: `Update ${user.name}!`,
          user: user,
        });
      })
      .catch((err) => {
        if (err.name == "ValidationError") {
          console.error("Error Validating!", err.message);
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
    .catch((err) => {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
