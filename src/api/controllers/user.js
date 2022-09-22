const User = require("../models/user");
const { message } = require("../common/message");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  generateToken,
  encryptPassword,
  comparePassword,
  encrypt,
  generateSalt,
} = require("../common/password");
//const HTTPStatus = require("htt")
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, password, confirmPassword, linkedinUrl, contactNo } = req.body;
    const hashedPassword = await encryptPassword(password);
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
    const { email, password } = req.body;
    const userDetail = await User.findOne({ email });

    const accessToken = await generateToken({
      id: userDetail._id,
    });

    const isPasswordCorrect = await comparePassword(
      password,
      userDetail.password
    );

    if (!isPasswordCorrect) {
      return res.status(500).json({
        message: "Password is incorrect",
      });
    }
    return res.status(200).json({
      message: message.LOGIN_SUCCESS,
      email: userDetail.email,
      accessToken
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};

exports.loginWithOauth = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne(
      {
        email: email
      }
    );
    if (!user) {
      const registrationData = await User.create({
        email,
      });
      return res.status(200).json({
        success: true,
        message: message.DATA_ADD_SUCCESS,
        data: registrationData,
      });
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

exports.changePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { oldPassword, password } = req.body;
    const profileDetail = await User.findById({ _id: userId });
    const isPasswordCorrect = await comparePassword(
      oldPassword,
      profileDetail.password
    );
    const hashedPassword = await encryptPassword(password);
    if (!isPasswordCorrect) {
      return res.status(500).json({
        messages: message.OLD_PASSWORD_INCORRECT,
      });
    } else {
      if (oldPassword == password) {
        return res.status(500).json({
          errMessage: message.PASSWORD_MATCH_ERROR,
        });
      }

      const updateProfile = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            password: hashedPassword,
            confirmPassword: password
          },
        },
        { new: true }
      );
      console.log("updateProfile..", updateProfile)
      return res.status(200).json({
        successMessage: message.CHANGE_PASSWORD_SUCCESS,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: "email not found",
      });
    }
    let firstName = user.firstName
    const id = encrypt(user._id);
    const verifyToken = id;
    const details = await User.updateOne({ _id: user._id }, { $set: { verifyToken: verifyToken } })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: '587',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      secureConnection: 'false',
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Please Reset your Password',
      html: `<h3>Dear ${firstName}</h3><p>You have requested to Reset your password. To Reset your password Successfully, Follow the Link bellow to Reset it</p><p>Click <a href='http://localhost:8001/v1/reset-pass?token=${verifyToken}'>reset password`
    };
    transporter.sendMail(mailOptions, function (error) {
      if (error) throw error;
      return res.status(200).json({
        message: "Email sent successfully",
        verifyToken
      });
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, verifyToken } = req.body
    const user = await User.findOne({ email, verifyToken })
    if (!user) {
      return res.status(404).json({
        message: "email not found",
      });
    }
    let salt = generateSalt(10);
    let newPassword = encryptPassword(password.trim(), salt);
    await User.updateOne({ email: email }, { $set: { password: newPassword, verifyToken: '' } })
    return res.status(200).json({
      message: "password updated successfully "
    });
  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
}

exports.resetPasswordPage = async (req, res) => {
  try {
    return res.send("reset password ");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: { message: message.ERROR_MESSAGE },
    });
  }
};
