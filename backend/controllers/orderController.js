const OrderService = require("../services/orderService");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const handleError = require("../utils/handleError");

// Create new Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const orders = await OrderService.createOrders(req.body, req.user._id);

  res.status(201).json({
    success: true,
    orders,
  });
});

// Get Single Order
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await OrderService.getSingleOrder(req.params.id);

  if (!order) {
    return next(new handleError("Order not found with this Id", 404));
  }

  // Check authorization
  const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
  const isSeller = order.orderItems.some(item => item.seller.toString() === req.user._id.toString());
  
  if (!isOwner && !isSeller) {
    return next(new handleError("Not authorized to view this order", 403));
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

// Update Order Status -- Seller
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const orderCheck = await OrderService.getSingleOrder(req.params.id);
  if (!orderCheck) {
    return next(new handleError("Order not found", 404));
  }
  
  const isSeller = orderCheck.orderItems.some(item => item.seller.toString() === req.user._id.toString());
  if (!isSeller) {
     return next(new handleError("Not authorized to update this order", 403));
  }

  const order = await OrderService.updateOrder(req.params.id, req.body.status);
  res.status(200).json({ success: true, order });
});

// Delete Order -- Seller
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const orderCheck = await OrderService.getSingleOrder(req.params.id);
  if (!orderCheck) {
    return next(new handleError("Order not found", 404));
  }
  
  const isSeller = orderCheck.orderItems.some(item => item.seller.toString() === req.user._id.toString());
  if (!isSeller) {
     return next(new handleError("Not authorized to delete this order", 403));
  }

  await OrderService.deleteOrder(req.params.id);
  res.status(200).json({ success: true });
});
