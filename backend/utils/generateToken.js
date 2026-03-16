const jwt = require("jsonwebtoken");

exports.generateToken = (userId, res) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("jwt", accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION" ? true : false,
    sameSite: "strict",
  });

  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, {
    expiresIn: "7d",
  });
  res.cookie("jwtrefresh", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION" ? true : false,
    sameSite: "strict",
  });

  return { accessToken, refreshToken };
};
