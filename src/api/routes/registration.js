const express = require("express");
const router = express.Router();
const userController = require("../controllers/registration");
const { handleValidationErrors } = require("../middleware/handleValidationErr");
const { registrationValidate } = require("../validator/validation");

router.post("/", registrationValidate,handleValidationErrors,userController.register);
//router.post("/login", checkExist.loginValidation, userController.login);


module.exports = router;