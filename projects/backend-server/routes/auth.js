const { Router } = require("express");
const { login } = require("../controllers/auth");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");

const router = Router();

router.post(
  "/",
  [
    check("password").exists().notEmpty(),
    check("email").isEmail(),
    validFields,
  ],
  login
);

module.exports = router;
