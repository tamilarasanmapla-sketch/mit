const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleError = require("../utils/handleError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.authenticate = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.token || req.cookies.jwt;

  if (!token) {
    return next(
      new handleError("Authentication token not provided. Please log in.", 401),
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return next(
      new handleError(
        "User belonging to this token does no longer exist.",
        401,
      ),
    );
  }
  req.user = user;
  next();
});
