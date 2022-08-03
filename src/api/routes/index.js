const { Router } = require("express");
const registrationRoute = require("./user");
const router = Router();


router.use("/", registrationRoute);

module.exports = router;
