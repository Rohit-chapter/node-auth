const { body } = require("express-validator");

exports.registrationValidate = [
    body("firstName").not().isEmpty().withMessage("First name is required"),
    body("lastName").not().isEmpty().withMessage("Last name is required"),
    body("email").not().isEmpty().withMessage("Email is required").isEmail()
        .withMessage("Email is invalid"),
    body("companyName").not().isEmpty().withMessage("Company name is required"),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .isString()
        .isLength({ min: 8 })
        .not()
        .withMessage(" length should be 8 characters")
        .isStrongPassword()
        .withMessage("Please select a stronger password")
        .isUppercase()
        .not()
        .withMessage(" one upper case is required")
        .isLowercase()
        .not()
        .withMessage(" one lower case is required")
        .isNumeric()
        .not()
        .withMessage(" one numeric is required"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm Password should not be empty")
        .custom(async (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match')
            }
        }),
    body("linkedinUrl").not().isEmpty().withMessage("Linkedin Url is required").isURL({ protocols: ['https'] }).withMessage("url is invalid"),
    body("contactNo").not().isEmpty().withMessage("Contact number is required").isNumeric().withMessage("Phone number must be in digit").isMobilePhone().isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digit"),
]