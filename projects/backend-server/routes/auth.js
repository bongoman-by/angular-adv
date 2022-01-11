const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn, renewToken } = require("../controllers/auth");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");

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

router.get("/renew", validJWT, renewToken);

module.exports = router;
