const handleError = require("../utils/handleError");

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new handleError(
          "Authentication is required to access this route.",
          401,
        ),
      );
    }

    if (!roles.includes(req.user.access)) {
      return next(
        new handleError(
          `Your role (${req.user.access}) is not authorized to access this resource.`,
          403,
        ),
      );
    }
    next();
  };
};
