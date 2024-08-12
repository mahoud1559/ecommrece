const mongoose = require("mongoose");
const userRole = require("../utils/users.roles");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },
    confirm_password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type: String,
      enum: [userRole.user, userRole.admin, userRole.manager, userRole.vendor],
      default: userRole.user,
    },
    token: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
