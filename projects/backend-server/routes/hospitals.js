const { Router } = require("express");
const {
  getHospitals,
  addHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");

const router = Router();

router.get("/", [validJWT], getHospitals);

router.post(
  "/",
  [
    validJWT,
    check("name", "Name of hospital does not exist or is empty")
      .exists()
      .notEmpty(),
    validFields,
  ],
  addHospital
);

router.put(
  "/:id",
  [
    validJWT,
    check("name", "Name of hospital does not exist or is empty")
      .exists()
      .notEmpty(),
    validFields,
  ],
  updateHospital
);

router.delete("/:id", [validJWT], deleteHospital);

module.exports = router;
