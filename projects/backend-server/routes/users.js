const { Router } = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT, validADMIN_ROLE } = require("../middlewares/valid-jwt");

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
    validADMIN_ROLE,
    check("name", "Name does not exist or is empty").exists().notEmpty(),
    check("email").exists().isEmail(),
    check("oldPassword").exists().notEmpty(),
    check("password").exists().notEmpty(),
    validFields,
  ],
  updateUser
);

router.delete("/:id", [validJWT, validADMIN_ROLE], deleteUser);

module.exports = router;
