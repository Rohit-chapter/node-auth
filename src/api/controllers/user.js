const User = require("../models/user");
const { message } = require("../common/message");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { firstName, lastName,email,companyName, password ,confirmPassword,linkedinUrl,contactNo} = req.body;
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
    originalPassword != inputPassword &&
      res.status(401).json("Invalid Password");
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    console.log("userId......",user._id)
    const { password, ...others } = user._doc;
    res.status(200).json({ message:message.LOGIN_SUCCESS, ...others, accessToken });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};
