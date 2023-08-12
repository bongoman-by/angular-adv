const { Router } = require("express");
const { search, getDocsCollection } = require("../controllers/search");
const { validJWT } = require("../middlewares/valid-jwt");

const router = Router();

router.get("/:condition", [validJWT], search);
router.get("/collection/:type/:condition", [validJWT], getDocsCollection);

module.exports = router;
