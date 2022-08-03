const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { handleValidationErrors } = require("../middleware/handleValidationErr");
const { registrationValidate } = require("../validator/validation");
const { loginValidation } = require("../validator/validation");

router.post("/registration", registrationValidate, handleValidationErrors, userController.register);
router.post("/login", loginValidation, handleValidationErrors, userController.login);


module.exports = router;