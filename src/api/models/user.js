const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    companyName: { type: String, },
    password: { type: String, required: true },
    confirmPassword: { type: String, },
    linkedinUrl: { type: String, },
    contactNo: {
      type: Number,
      min: 10,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);