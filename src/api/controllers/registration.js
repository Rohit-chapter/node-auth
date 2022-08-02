const User = require("../models/registration");
const bcrypt = require("bcryptjs");
const { message } = require("../common/message");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName,email,companyName, password ,confirmPassword,linkedinUrl,contactNo} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const registrationData = await User.create({
      firstName,
      lastName,
      email,
      companyName,
      password: hashedPassword,
      confirmPassword,
      linkedinUrl,
      contactNo
    });

    return res.status(200).json({
      success: true,
      message: DATA_ADD_SUCCESS,
      data: registrationData,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};