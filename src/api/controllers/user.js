const User = require("../models/user");
const { message } = require("../common/message");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
//const HTTPStatus = require("htt")
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, password, confirmPassword, linkedinUrl, contactNo } = req.body;
    const registrationData = await User.create({
      firstName,
      lastName,
      email,
      companyName,
      password: CryptoJS.AES.encrypt(password,
        process.env.PASS_SEC
      ).toString(),
      confirmPassword,
      linkedinUrl,
      contactNo
    });

    return res.status(200).json({
      success: true,
      message: message.DATA_ADD_SUCCESS,
      data: registrationData,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne(
      {
        email: email
      }
    );
    //!user && res.status(401).json("Wrong User Name");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;
    if (originalPassword != inputPassword) {
      return res.status(401).json("Invalid Password");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    //return res.redirect("/v1/profile");
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      email: user.email,
      accessToken
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

exports.loginWithOauth = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(
      {
        email: email
      }
    );
    if (!user) {
      const registrationData = await User.create({
        email,
        password: CryptoJS.AES.encrypt(password,
          process.env.PASS_SEC
        ).toString(),
      });

      return res.status(200).json({
        success: true,
        message: message.DATA_ADD_SUCCESS,
        data: registrationData,
      });
    }
    //!user && res.status(401).json("Wrong User Name");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const inputPassword = req.body.password;
    if (originalPassword != inputPassword) {
      return res.status(401).json("Invalid Password");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      email: user.email,
      accessToken
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req;
  const userDetails = await User.findById({ _id: userId });
  console.log("userDetails...", userDetails)
  const details = {
    _id: userDetails._id,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    companyName: userDetails.companyName,
    contactNo: userDetails.contactNo,
  }
  return res.status(200).json({
    details
  });
};
