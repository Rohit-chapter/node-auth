const { Router } = require("express");
const registrationRoute = require("./registration");
const router = Router();


router.use("/registration", registrationRoute);

module.exports = router;
