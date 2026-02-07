const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async () => {
    return await Product.find();
};

// Create a new product
exports.createProduct = async (productData, sellerId) => {
    const product = new Product({
        ...productData,
        seller: sellerId,
    });
    return await product.save();
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
        throw new Error("You are not authorized to update this product");
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
        throw new Error("You are not authorized to delete this product");
    }

    return await product.deleteOne();
};
