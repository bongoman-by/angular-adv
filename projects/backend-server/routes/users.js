const { Router } = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");

const router = Router();

router.get("/", [validJWT], getUsers);

router.post(
  "/",
  [
    check("name", "Name is not exist or is empty").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("email").isEmail(),
    validFields,
  ],
  addUser
);

router.put(
  "/:id",
  [
    validJWT,
    check("name", "Name is not exist or is empty").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("email").isEmail(),
    validFields,
  ],
  updateUser
);

router.delete("/:id", [validJWT], deleteUser);

module.exports = router;
