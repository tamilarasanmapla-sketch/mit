class handleError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, handleError);
  }
}

module.exports = handleError;
