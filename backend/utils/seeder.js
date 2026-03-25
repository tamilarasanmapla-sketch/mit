const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const products = require("../data/products.json");

const path = require("path");
// Setting up config file
dotenv.config({ path: path.join(__dirname, "../../.env") });

mongoose.connect(process.env.DB_URL);

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("All Products are added.");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
