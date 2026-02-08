const Order = require("../models/Order");
const Product = require("../models/Product");

// Create new order
exports.createOrder = async (orderData) => {
  // Validate stock for all items and deduct immediately
  for (const item of orderData.orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.productName}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.productName}`);
    }

    // Deduct stock
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const order = await Order.create(orderData);
  return order;
};

// Get single order
exports.getSingleOrder = async (orderId) => {
  return await Order.findById(orderId).populate("user", "userName email");
};

// Get logged in user orders
exports.myOrders = async (userId) => {
  return await Order.find({ user: userId });
};

// Get all orders (Admin)
exports.getAllOrders = async () => {
  let orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  return { orders, totalAmount };
};

// Update order status (Admin)
exports.updateOrder = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.orderStatus === "Delivered") {
    throw new Error("You have already delivered this order");
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  return order;
};

// Delete Order
exports.deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  await order.deleteOne();
  return true;
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${product.productName}`);
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
