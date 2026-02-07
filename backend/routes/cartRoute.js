const express = require("express");
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { authenticate } = require("../middleware/authentication");

const router = express.Router();

router.route("/")
    .get(authenticate, getCart)
    .post(authenticate, addToCart)
    .delete(authenticate, clearCart);

router.route("/:productId")
    .delete(authenticate, removeFromCart);

module.exports = router;
