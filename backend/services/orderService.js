const Order = require("../models/Order");
const Product = require("../models/Product");
const handleError = require("../utils/handleError");
const mongoose = require("mongoose");

// Create new orders (Split by seller)
exports.createOrders = async (orderData, userId) => {
  const { orderItems, shippingInfo, paymentInfo } = orderData;

  // Group items by seller
  const itemsBySeller = orderItems.reduce((acc, item) => {
    const sId = item.seller;
    if (!acc[sId]) acc[sId] = [];
    acc[sId].push(item);
    return acc;
  }, {});

  const createdOrders = [];

  // Start transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const sellerId in itemsBySeller) {
      const sellerItems = itemsBySeller[sellerId];

      // Calculate totals for this sub-order
      const itemsPrice = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const shippingPrice = itemsPrice > 100 ? 0 : 25;
      const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      // Validate stock and deduct using atomic operations
      for (const item of sellerItems) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          throw new handleError(`Product not found: ${item.productName}`, 404);
        }
        if (product.stock < item.quantity) {
          throw new handleError(
            `Insufficient stock for product ${product.productName}`,
            400,
          );
        }

        // Use atomic $inc operation to prevent race conditions
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      const order = await Order.create([{
        shippingInfo,
        orderItems: sellerItems,
        user: userId,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
      }], { session });

      createdOrders.push(order[0]);
    }

    // Commit transaction
    await session.commitTransaction();
    return createdOrders;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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

// Update order status (Seller/Admin)
exports.updateOrder = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new handleError("Order not found", 404);

  const currentStatus = order.orderStatus;
  const validStatuses = [
    "Processing",
    "Accepted",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new handleError("Invalid status", 400);
  }

  // Define valid transitions
  const transitions = {
    Processing: ["Accepted", "Packed", "Cancelled"],
    Accepted: ["Packed", "Cancelled"],
    Packed: ["Shipped", "Cancelled"],
    Shipped: ["Delivered", "Cancelled"],
    Delivered: [],
    Cancelled: [],
  };

  if (currentStatus === status) {
    return order; // No change needed
  }

  if (!transitions[currentStatus] || !transitions[currentStatus].includes(status)) {
    throw new handleError(
      `Cannot transition from ${currentStatus} to ${status}`,
      400
    );
  }

  // Handle Stock Reversal on Cancellation
  if (status === "Cancelled") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
      order.orderStatus = status;
      await order.save({ validateBeforeSave: false, session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    order.orderStatus = status;
    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
  }

  return order;
};

// Delete Order
exports.deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new handleError("Order not found", 404);

  await order.deleteOne();
  return true;
};
