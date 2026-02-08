const ProductService = require("../services/productService");
const handleError = require("../utils/handleError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// Get all products
exports.getProducts = asyncErrorHandler(async (req, res) => {
  const products = await ProductService.getAllProducts();
  res.json({ success: true, products });
});

// Create a new product
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const { productName, description, price, category, stock } = req.body;
  if (!productName || !description || !price || !category) {
    return next(new handleError("Please provide all required fields", 400));
  }

  const productData = {
    productName,
    description,
    price,
    category,
    stock,
  };

  const newProduct = await ProductService.createProduct(
    productData,
    req.user?._id,
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: newProduct,
  });
});

// Get product by ID
exports.getProductById = asyncErrorHandler(async (req, res, next) => {
  const product = await ProductService.getProductById(req.params.id);
  if (!product) {
    return next(new handleError("Product not found", 404));
  }
  res.json({ success: true, product });
});

// Update product by ID
exports.updateProductById = asyncErrorHandler(async (req, res, next) => {
  const { productName, description, price, category, stock } = req.body;

  const updateData = {};
  if (productName) updateData.productName = productName;
  if (description) updateData.description = description;
  if (price) updateData.price = price;
  if (category) updateData.category = category;
  if (category) updateData.category = category;
  if (stock) updateData.stock = stock;

  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      updateData,
      req.user._id,
    );

    if (!updatedProduct) {
      return next(new handleError("Product not found", 404));
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return next(new handleError(error.message, 403));
  }
});

// Delete product by ID
exports.deleteProductById = asyncErrorHandler(async (req, res, next) => {
  try {
    const deletedProduct = await ProductService.deleteProduct(
      req.params.id,
      req.user._id,
    );

    if (!deletedProduct) {
      return next(new handleError("Product not found", 404));
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return next(new handleError(error.message, 403));
  }
});
