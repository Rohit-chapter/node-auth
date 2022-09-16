const { body } = require("express-validator");
const User = require("../models/user")

exports.registrationValidate = [
    body("firstName").not().isEmpty().withMessage("First name is required"),
    body("lastName").not().isEmpty().withMessage("Last name is required"),
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid Email")
        .custom(async (value) => {
            const emailCheck = await User.findOne({ email: value });
            if (emailCheck) {
                throw new Error("email is already taken");
            }
        }),
    body("companyName").not().isEmpty().withMessage("Company name is required"),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .isString()
        .isLength({ min: 8 })
        .not()
        .withMessage(" length should be 8 characters")
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

exports.loginValidation = [
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid Email")
        .custom(async (value) => {
            const emailCheck = await User.findOne({ email: value });
            if (!emailCheck) {
                throw new Error("Email not present");
            }
        }),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
]