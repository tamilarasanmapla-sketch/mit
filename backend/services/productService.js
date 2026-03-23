const Product = require("../models/Product");
const ApiFilter = require("../utils/apiFilter");
const handleError = require("../utils/handleError");

// Get products
exports.getProducts = async (queryStr, resPerPage) => {
  const productCount = await Product.countDocuments();
  const apiFilter = new ApiFilter(Product.find(), queryStr).search().filter();

  // Get filtered products count before pagination
  const filteredProductsCount = await apiFilter.query.clone().countDocuments();

  // Apply pagination
  apiFilter.pagination(resPerPage);
  const products = await apiFilter.query.clone();

  return { products, productCount, filteredProductsCount };
};

// Create a new product
exports.createProduct = async (productData, sellerId) => {
  const product = await Product.create({
    ...productData,
    seller: sellerId,
  });
  return product;
};

// Get product by ID
exports.getProductById = async (id) => {
  return await Product.findById(id);
};

// Update product
exports.updateProduct = async (id, updateData, sellerId) => {
  const product = await Product.findById(id);
  if (!product) return null;

  // Verify ownership
  if (product.seller.toString() !== sellerId.toString()) {
    throw new handleError("You are not authorized to update this product", 403);
  }

  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });

  return await product.save();
};

// Delete product
exports.deleteProduct = async (id, sellerId) => {
  const product = await Product.findById(id);
  if (!product) return null;

  // Verify ownership
  if (product.seller.toString() !== sellerId.toString()) {
    throw new handleError("You are not authorized to delete this product", 403);
  }

  return await product.deleteOne();
};
