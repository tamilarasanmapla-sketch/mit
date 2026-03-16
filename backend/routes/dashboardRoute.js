const express = require("express");
const router = express.Router();
const { getSellerStats } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/authentication");
const { authorize } = require("../middleware/authorization");

// Seller routes only
router.get("/seller/stats", authenticate, authorize("seller"), getSellerStats);

module.exports = router;
