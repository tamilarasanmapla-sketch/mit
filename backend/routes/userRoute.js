const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserById,
  login,
  logout,
} = require("../controllers/userController.js");
const { authenticate } = require("../middleware/authentication.js");

router.post("/createuser", createUser);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.put(
  "/updateuser/:id",
  authenticate,
  (req, res, next) => {
    if (req.user._id.toString() !== req.params.id) {
      return next(
        new (require("../utils/handleError"))(
          "You can only update your own profile",
          403,
        ),
      );
    }
    next();
  },
  updateUserById,
);

module.exports = router;
