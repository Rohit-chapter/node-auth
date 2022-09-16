const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { handleValidationErrors } = require("../middleware/handleValidationErr");
const { registrationValidate } = require("../validator/validation");
const { loginValidation } = require("../validator/validation");
const { verifyToken } = require("../middleware/validateToken")

router.post("/registration", registrationValidate, handleValidationErrors, userController.register);
router.post("/login", loginValidation, handleValidationErrors, userController.login);
router.post("/oauth", userController.loginWithOauth);
router.get("/profile", verifyToken, userController.getUserById);

module.exports = router;