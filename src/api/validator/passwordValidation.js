const { body } = require("express-validator");
exports.updatePasswordValidation = [
    body("password")
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 character long.")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
        .withMessage(
            "Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character."
        )
        .not()
        .matches(/^$|\s+/)
        .withMessage("White space not allowed"),
    body("oldPassword").not().isEmpty().withMessage("Old password is required"),
];