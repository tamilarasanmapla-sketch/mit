const ProductService = require("../services/productService");
const handleError = require("../utils/handleError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

// Get products
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  const resPerPage = 8;
  const { products, productCount, filteredProductsCount } =
    await ProductService.getProducts(req.query, resPerPage);

  res.json({
    success: true,
    products,
    productCount,
    filteredProductsCount,
    resPerPage,
  });
});

// Create a new product
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const { productName, description, price, category, stock } = req.body;
  if (!productName || !description || !price || !category) {
    return next(new handleError("Please provide all required fields", 400));
  }

  if (stock === undefined || stock === null || stock < 0 || !Number.isInteger(Number(stock))) {
    return next(new handleError("Stock must be a non-negative integer", 400));
  }

  if (price <= 0) {
    return next(new handleError("Price must be greater than 0", 400));
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
  if (productName !== undefined) updateData.productName = productName;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) {
    if (price <= 0) {
      return next(new handleError("Price must be greater than 0", 400));
    }
    updateData.price = price;
  }
  if (category !== undefined) updateData.category = category;
  if (stock !== undefined) {
    if (stock < 0 || !Number.isInteger(Number(stock))) {
      return next(new handleError("Stock must be a non-negative integer", 400));
    }
    updateData.stock = stock;
  }

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
});

// Delete product by ID
exports.deleteProductById = asyncErrorHandler(async (req, res, next) => {
  const deletedProduct = await ProductService.deleteProduct(
    req.params.id,
    req.user._id,
  );

  if (!deletedProduct) {
    return next(new handleError("Product not found", 404));
  }

  res.json({ success: true, message: "Product deleted successfully" });
});
