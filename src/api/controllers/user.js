const User = require("../models/user");
const { message } = require("../common/message");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { Email, AVAILABLE_TEMPLATES } = require("../utils/email")
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


// exports.login = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne(
//       {
//         email: email
//       }
//     );
//     //!user && res.status(401).json("Wrong User Name");
//     const hashedPassword = CryptoJS.AES.decrypt(
//       user.password,
//       process.env.PASS_SEC
//     );
//     const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
//     const inputPassword = req.body.password;
//     if (originalPassword != inputPassword) {
//       return res.status(401).json("Invalid Password");
//     }
//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "1d" }
//     );
//     res.cookie("jwtCookies", accessToken, {
//       expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     });
//     //return res.redirect("/v1/profile");
//     return res.status(200).json({
//       message: message.LOGIN_SUCCESS,
//       email: user.email,
//       accessToken
//     });
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       message: message.ERROR_MESSAGE,
//     });
//   }
// };

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
    console.log("isPasswordCorrect..", isPasswordCorrect, oldPassword, password)
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
    // console.log("req", req)
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: "email not found",
      });
    }
    console.log("user....", user)
    // const encryptedEmail = encrypt(email.trim());
    const id = encrypt(user._id);
    console.log("id...", id)
    const verifyToken = encrypt(id);
    const details = await User.updateOne({ _id: user._id }, { $set: { verifyToken: verifyToken } })
    console.log("details....", details)
    console.log("verifyToken.....", verifyToken)
    const forEmail = new Email();
    console.log("forEmail..", forEmail)
    await forEmail.setTemplate(AVAILABLE_TEMPLATES.FORGET_PASSWORD, {
      firstName: `${user.firstName}`,
      lastName: `${user.lastName}`,
      verifyToken: verifyToken,
      id: id,
      // email: encryptedEmail
    });
    await forEmail.send(user.email);
    return res.status(200).json({
      message: "success"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, verifyToken } = req.body
    const user = await User.findOne({ email, verifyToken })
    if (!user) {
      return res.status(404).json({
        message: "email not match",
      });
    }
    let salt = generateSalt(10);
    let newPassword = encryptPassword(password.trim(), salt);
    await User.updateOne({ email: email }, { $set: { password: newPassword, verifyToken: '' } })
    return res.status(200).json({
      message: "password update "
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : message.ERROR_MESSAGE,
    });
  }
}