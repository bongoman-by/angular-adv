const { Router } = require("express");
const expressFileUpload = require("express-fileupload");

const { fileUpload, viewImage } = require("../controllers/uploads");
const { validJWT } = require("../middlewares/valid-jwt");

const router = Router();
router.use(expressFileUpload());

router.put("/:type/:id", [validJWT], fileUpload);
router.get("/:type/:photo", viewImage);

module.exports = router;
