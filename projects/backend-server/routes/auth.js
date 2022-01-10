const { Router } = require("express");
const { login, googleSignIn } = require("../controllers/auth");
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

router.post(
  "/google",
  [check("token").exists().notEmpty(), validFields],
  googleSignIn
);

module.exports = router;
