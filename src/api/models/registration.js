const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    contactNo: {
      type: Number,
      min: 10,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);