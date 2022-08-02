const { body } = require("express-validator");

exports.registrationValidate = [
    body("firstName").not().isEmpty().withMessage("First name is required"),
    body("lastName").not().isEmpty().withMessage("Last name is required"),
    body("email").not().isEmpty().withMessage("Email is required").isEmail()
    .withMessage("Email is invalid"),
    body("companyName").not().isEmpty().withMessage("Company name is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
    body("confirmPassword").not().isEmpty().withMessage("Confirm password is required"),
    body("linkedinUrl").not().isEmpty().withMessage("Linkedin Url is required"),
    body("contactNo").not().isEmpty().withMessage("Phone number is required").isNumeric().withMessage("Phone number must be in digit").isMobilePhone().isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digit"),
]