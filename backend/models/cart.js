const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
