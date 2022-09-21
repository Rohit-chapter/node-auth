const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    companyName: { type: String, },
    password: { type: String },
    confirmPassword: { type: String, },
    linkedinUrl: { type: String, },
    contactNo: {
      type: Number,
      min: 10,
    },
    verifyToken: { type: String, },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);