const Cart = require("../models/cart");
const Product = require("../models/Product");
const handleError = require("../utils/handleError");

// Get cart by user ID
exports.getCartByUserId = async (userId) => {
  return await Cart.findOne({ customer: userId }).populate("items.product");
};

// Add item to cart
exports.addItemToCart = async (userId, productId, quantity, sellerId) => {
  const product = await Product.findById(productId);
  if (!product) throw new handleError("Product not found", 404);

  // Check stock availability
  if (product.stock < quantity) {
    throw new handleError(
      `Insufficient stock. Only ${product.stock} items available`,
      400,
    );
  }

  let cart = await Cart.findOne({ customer: userId });

  // Use discounted price if available, otherwise regular price
  const effectivePrice = product.discountedPrice || product.price;

  if (cart) {
    // Cart exists for user
    const itemIndex = cart.items.findIndex(
      (p) =>
        p.product.toString() === productId.toString() &&
        p.seller.toString() === sellerId.toString(),
    );

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      let productItem = cart.items[itemIndex];
      const newQuantity = Math.max(1, productItem.quantity + quantity);

      // Check if total quantity exceeds stock
      if (product.stock < newQuantity) {
        throw new handleError(
          `Insufficient stock. Only ${product.stock} items available`,
          400,
        );
      }

      productItem.quantity = newQuantity;
      productItem.subtotal = productItem.quantity * effectivePrice;
      cart.items[itemIndex] = productItem;
    } else {
      // Product does not exist in cart, add new item
      // For new items, quantity must be positive
      if (quantity < 1) {
        throw new handleError("Initial quantity must be at least 1", 400);
      }
      cart.items.push({
        product: productId,
        seller: sellerId,
        quantity: quantity,
        subtotal: quantity * effectivePrice,
      });
    }
  } else {
    // No cart for user, create new cart
    // For new items, quantity must be positive
    if (quantity < 1) {
      throw new handleError("Initial quantity must be at least 1", 400);
    }
    cart = await Cart.create({
      customer: userId,
      items: [
        {
          product: productId,
          seller: sellerId,
          quantity: quantity,
          subtotal: quantity * effectivePrice,
        },
      ],
    });
  }

  return cart;
};

// Remove item from cart
exports.removeItemFromCart = async (userId, productId, sellerId) => {
  let cart = await Cart.findOne({ customer: userId });
  if (!cart) throw new handleError("Cart not found", 404);

  cart.items = cart.items.filter((item) => {
    const sameProduct = item.product.toString() === productId.toString();
    const sameSeller =
      !sellerId || item.seller.toString() === sellerId.toString();
    return !(sameProduct && sameSeller);
  });
  return await cart.save();
};

// Clear cart
exports.clearCart = async (userId) => {
  return await Cart.findOneAndDelete({ customer: userId });
};
