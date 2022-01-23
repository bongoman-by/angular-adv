const { Router } = require("express");
const {
  getDoctors,
  getDoctor,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctors");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");
const { validJWT } = require("../middlewares/valid-jwt");

const router = Router();

router.get("/", [validJWT], getDoctors);

router.get("/:id", [validJWT], getDoctor);

router.post(
  "/",
  [
    validJWT,
    check("name", "Name of doctor does not exist or is empty")
      .exists()
      .notEmpty(),
    check("hospital", "Hospital should be valid mongo id").isMongoId(),
    validFields,
  ],
  addDoctor
);

router.put(
  "/:id",
  [
    validJWT,
    check("name", "Name of doctor does not exist or is empty")
      .exists()
      .notEmpty(),
    check("hospital", "Hospital should be valid mongo id").isMongoId(),
    validFields,
  ],
  updateDoctor
);

router.delete("/:id", [validJWT], deleteDoctor);

module.exports = router;
