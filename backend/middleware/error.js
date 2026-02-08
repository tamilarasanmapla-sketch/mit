exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
