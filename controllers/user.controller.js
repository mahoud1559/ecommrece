const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.modle");
const ERROR = require("../utils/ERROR");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, confirm_password, role } = req.body;
  if (password !== confirm_password) {
    const error = ERROR.create(
      "Passwords do not match",
      422,
      "passwords do not match"
    );
    return next(error);
  }

  const existsUser = await User.findOne({ email: email });
  if (existsUser) {
    const error = ERROR.create(
      "User already exists",
      422,
      "email already exists"
    );
    return next(error);
  }

  //! password hashing;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    role,
    password: hashedPassword,
    confirm_password: hashedPassword,
  });

  if (!process.env.JWT_SECRET_KEY) {
    const error = ERROR.create(
      "JWT secret key is not defined",
      500,
      "internal server error"
    );
    return next(error);
  }

  newUser.token = jwt.sign(
    { email: newUser.email, id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  await newUser.save();

  const {
    password: pwd,
    confirm_password: confPwd,
    ...userWithoutPassword
  } = newUser._doc;
  res
    .status(201)
    .json({
      code: 201,
      message: "User registered successfully",
      user: userWithoutPassword,
    });
});

//? =>
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = ERROR.create(
      "Please provide email and password",
      422,
      "email and password are required"
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    const error = ERROR.create("User not found", 404, "not found any user");
    return next(error);
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    const error = ERROR.create(
      "Invalid password",
      401,
      "password is incorrect"
    );
    return next(error);
  }

  if (!process.env.JWT_SECRET_KEY) {
    const error = ERROR.create(
      "JWT secret key is not defined",
      500,
      "internal server error"
    );
    return next(error);
  }

  user.token = jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  await user.save();
  const {
    password: pwd,
    confirm_password: confPwd,
    ...userWithoutPassword
  } = user._doc;
  res.json({
    code: 200,
    message: "Login successful",
    UserInformation: userWithoutPassword,
  });
});

const getAllUsers = asyncWrapper(async (req, res) => {
    // ? get all data
    // const query = req.query;
    // const limit = query.limit || 8;
    // const page = query.page || 1;
    // const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: 0, password: 0, confirm_password: 0 })
  res.json({ code: 200, message: "OK", users: users });
});

const singleUser = asyncWrapper(async(req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  if(!user) {
    const error = ERROR.create("user not found", 404, "this user is not found");
    return next(error);
  }
  const { password, confirm_password, ...userWithoutPassword } = user.toObject();
  res.json({ code: 200, data: { user: userWithoutPassword } });
});

const deleteUser = asyncWrapper(async(req, res, next) => {
  const data = await User.deleteOne({ _id: req.params.id });
  res.status(404).json({ status: 404, message: 'user not found'});
  res.status(200).json({ message: 'done', data: null });
})

const editUser = asyncWrapper(async(req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const changeUserInfo = await User.findByIdAndUpdate(id, { $set: { ...body } }, { new: true });
  if (!changeUserInfo) {
    const error = ERROR.create("user not found", 404, "this user is not found");
    return next(error);
  }
  const { password, confirm_password, ...userWithoutPassword } = changeUserInfo.toObject();
  res.status(200).json({ code: 200, message: "User updated successfully", data: userWithoutPassword });
})

module.exports = { register, login, getAllUsers, singleUser, deleteUser, editUser };