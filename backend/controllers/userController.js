const UserService = require("../services/userService");
const { generateToken } = require("../utils/generateToken.js");
const HandleError = require("../utils/handleError.js");
const asyncErrorHandler = require("../utils/asyncErrorHandler.js");

// Get all users
exports.getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await UserService.getAllUsers();
  res.json(users);
});

// Get user by ID
exports.getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await UserService.getUserById(req.params.id);
  if (!user) {
    return next(new HandleError("User not found", 404));
  }
  res.json(user);
});

// Login User
exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Please provide email and password", 400));
  }

  const user = await UserService.loginUser(email, password);

  const { accessToken } = generateToken(user._id, res);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      access: user.access,
      accessToken,
    },
  });
});

// Logout User
exports.logout = asyncErrorHandler(async (req, res, next) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.cookie("jwtrefresh", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Create a new user (Register)
exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const { userName, email, access, password } = req.body;

  if (!userName || !email || !password) {
    return next(new HandleError("Please provide all required fields", 400));
  }

  const newUser = await UserService.createUser({
    userName,
    email,
    access,
    password,
  });

  // Generate token logic remains in controller as it deals with response/cookies
  const { accessToken } = generateToken(newUser._id, res);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      access: newUser.access,
      accessToken,
    },
  });
});

// Update user by ID
exports.updateUserById = asyncErrorHandler(async (req, res, next) => {
  const { updateUserName, updatePassword } = req.body;
  if (!updateUserName && !updatePassword) {
    return next(new HandleError("Please provide fields to update", 400));
  }

  const updatedUser = await UserService.updateUser(req.params.id, {
    userName: updateUserName,
    password: updatePassword,
  });

  res.json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

// Delete user by ID
exports.deleteUserById = asyncErrorHandler(async (req, res, next) => {
  await UserService.deleteUser(req.params.id);
  res.json({ success: true, message: "User deleted successfully" });
});
