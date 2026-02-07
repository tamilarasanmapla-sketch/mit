const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  createUser,
  updateUserById,
  login,
  logout
} = require("../controllers/userController.js");
const { authorize } = require("../middleware/authorization.js");
const { authenticate } = require("../middleware/authentication.js");

router.get("/getallusers", authenticate, authorize("admin"), getAllUsers);
router.get("/getuser/:id", authenticate,authorize("admin"), getUserById);
router.delete("/deleteuser/:id", authenticate, authorize("admin"), deleteUserById);
router.post("/createuser", createUser);
router.post("/login", login);
router.get("/logout",authenticate, logout);
router.put("/updateuser/:id", authenticate, updateUserById);


module.exports = router;
