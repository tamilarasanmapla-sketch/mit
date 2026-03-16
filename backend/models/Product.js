const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, "Price must be greater than 0"],
    },
    discountedPrice: {
      type: Number,
      min: [0, "Discounted price cannot be negative"],
      validate: {
        validator: function(value) {
          if (value === undefined || value === null) return true;
          return value < this.price;
        },
        message: "Discounted price must be less than original price",
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "electronics",
        "fashion",
        "home",
        "books",
        "toys",
        "sports",
        "others",
      ],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
