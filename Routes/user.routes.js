const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/Protected.Routes");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utils/users.roles");
const multer = require('multer');
const upload = multer();

router.route("/register").post(upload.none(), userController.register);
router.route("/login").post(verifyToken, userController.login);
router
  .route("/show-users")
  .get(
    verifyToken,
    allowedTo(userRole.admin, userRole.manager),
    userController.getAllUsers
  );

router
  .route("/single/:id")
  .get(
    verifyToken,
    allowedTo(userRole.admin, userRole.manager),
    userController.singleUser
  );

router
  .route("/delete/:id")
  .delete(
    verifyToken,
    allowedTo(userRole.admin, userRole.manager, userRole.user, userRole.vendor),
    userController.deleteUser
  );

router.route("/edit/:id").patch(verifyToken, userController.editUser);

module.exports = router;
