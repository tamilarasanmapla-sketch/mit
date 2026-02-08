const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { authenticate } = require("../middleware/authentication");
const { authorize } = require("../middleware/authorization");

const router = express.Router();

router.route("/new").post(authenticate, newOrder);

router.route("/me").get(authenticate, myOrders);

router
  .route("/:id")
  .get(authenticate, getSingleOrder)
  .put(authenticate, authorize("seller"), updateOrder)
  .delete(authenticate, authorize("seller"), deleteOrder);

router
  .route("/admin/orders")
  .get(authenticate, authorize("admin"), getAllOrders);

module.exports = router;
