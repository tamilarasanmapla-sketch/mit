const User = require("../models/User");
const handleError = require("../utils/handleError");

// Get all users
const getAllUsers = async () => {
  return await User.find().select("-password");
};

// Get user by ID
const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new handleError("User not found", 404);
  }
  return user;
};

// Login User
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new handleError("Invalid email or password", 401);
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new handleError("Invalid email or password", 401);
  }

  return user;
};

// Create User
const createUser = async (userData) => {
  const { email } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new handleError("User already exists", 400);
  }

  const newUser = new User(userData);
  return await newUser.save();
};

// Update User
const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) throw new handleError("User not found", 404);

  if (updateData.userName) user.userName = updateData.userName;
  if (updateData.password) {
    if (!updateData.oldPassword) {
      throw new handleError("Current password required to change password", 400);
    }
    if (updateData.password.length < 8) {
      throw new handleError("New password must be at least 8 characters", 400);
    }
    const isPasswordMatched = await user.comparePassword(updateData.oldPassword);
    if (!isPasswordMatched) {
      throw new handleError("Current password is incorrect", 401);
    }
    user.password = updateData.password;
  }

  return await user.save();
};

// Delete User
const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new handleError("User not found", 404);

  return await user.deleteOne();
};

module.exports = {
  getAllUsers,
  getUserById,
  loginUser,
  createUser,
  updateUser,
  deleteUser,
};
