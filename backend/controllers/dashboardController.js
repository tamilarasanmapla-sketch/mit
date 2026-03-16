const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// ─── Seller Stats ────────────────────────────────────────────────────────────
exports.getSellerStats = asyncErrorHandler(async (req, res) => {
  const sellerId = req.user._id;

  const [sellerProducts, allOrders] = await Promise.all([
    Product.find({ seller: sellerId }).lean(),
    Order.find({ "orderItems.seller": sellerId }).lean(),
  ]);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ordersToday = allOrders.filter((o) => new Date(o.createdAt) >= todayStart).length;

  const totalSales = allOrders.reduce((sum, o) => {
    const items = o.orderItems.filter(
      (i) => i.seller && i.seller.toString() === sellerId.toString()
    );
    return sum + items.reduce((s, i) => s + i.price * i.quantity, 0);
  }, 0);

  const lowStockProducts = sellerProducts.filter((p) => p.stock < 10).length;
  const pendingOrders = allOrders.filter((o) => o.orderStatus === "Processing").length;

  // Sales per day (last 7 days)
  const salesPerDay = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const dayOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= dayStart && new Date(o.createdAt) < dayEnd
    );
    const daySales = dayOrders.reduce((sum, o) => {
      const items = o.orderItems.filter(
        (i) => i.seller && i.seller.toString() === sellerId.toString()
      );
      return sum + items.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);
    salesPerDay.push({
      day: dayStart.toLocaleString("default", { weekday: "short" }),
      sales: daySales,
    });
  }

  // Product performance
  const productPerformance = sellerProducts.map((p) => {
    const totalSold = allOrders.reduce((sum, o) => {
      const item = o.orderItems.find(
        (i) => i.product && i.product.toString() === p._id.toString()
      );
      return sum + (item ? item.quantity : 0);
    }, 0);
    return { name: p.productName, sold: totalSold, stock: p.stock };
  });

  res.json({
    success: true,
    stats: {
      totalSales,
      ordersToday,
      productsListed: sellerProducts.length,
      pendingOrders,
      lowStockProducts,
    },
    salesPerDay,
    productPerformance,
    products: sellerProducts,
    orders: allOrders,
  });
});
