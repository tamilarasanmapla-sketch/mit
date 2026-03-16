const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/error.js");

//import routes
const userRouter = require("./routes/userRoute.js");
const productRouter = require("./routes/productRoute.js");
const cartRouter = require("./routes/cartRoute.js");
const orderRouter = require("./routes/orderRoute.js");
const dashboardRouter = require("./routes/dashboardRoute.js");

const app = express();

app.use(helmet());

// Logging
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

//routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);

// Error Middleware
app.use(errorHandler);

module.exports = app;
