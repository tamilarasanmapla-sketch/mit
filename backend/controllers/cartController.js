const CartService = require("../services/cartService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const handleError = require("../utils/handleError");

// Get Cart
exports.getCart = asyncErrorHandler(async (req, res, next) => {
  const cart = await CartService.getCartByUserId(req.user._id);
  if (!cart) {
    return res.json({ success: true, cart: { items: [] } });
  }
  res.json({ success: true, cart });
});

// Add to Cart
exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const { productId, quantity, sellerId } = req.body;

  if (!productId || !quantity || !sellerId) {
    return next(
      new handleError("Please provide product, quantity and seller", 400),
    );
  }

  const cart = await CartService.addItemToCart(
    req.user._id,
    productId,
    quantity,
    sellerId,
  );
  res.status(200).json({ success: true, cart });
});

// Remove from Cart
exports.removeFromCart = asyncErrorHandler(async (req, res, next) => {
  const cart = await CartService.removeItemFromCart(
    req.user._id,
    req.params.productId,
  );
  res.json({ success: true, cart });
});

// Clear Cart
exports.clearCart = asyncErrorHandler(async (req, res, next) => {
  await CartService.clearCart(req.user._id);
  res.json({ success: true, message: "Cart cleared" });
});
