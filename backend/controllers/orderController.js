const OrderService = require("../services/orderService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const handleError = require("../utils/handleError");

// Create new Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const orderData = {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  };

  const order = await OrderService.createOrder(orderData);

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await OrderService.getSingleOrder(req.params.id);

  if (!order) {
    return next(new handleError("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await OrderService.myOrders(req.user._id);

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders -- Admin
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { orders, totalAmount } = await OrderService.getAllOrders();

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order Status -- Admin
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await OrderService.updateOrder(req.params.id, req.body.status);
  res.status(200).json({ success: true, order });
});

// Delete Order -- Admin
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  await OrderService.deleteOrder(req.params.id);
  res.status(200).json({ success: true });
});
