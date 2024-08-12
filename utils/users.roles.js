const { model } = require("mongoose");

const userRole = {
  user: "user",
  admin: "admin",
  manager: "manager",
  vendor: "vendor",
};

module.exports = userRole;
