const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/productController.js");
const { authorize } = require("../middleware/authorization.js");
const { authenticate } = require("../middleware/authentication.js");

router.get("/getallproducts", getProducts);
router.get("/getproduct/:id", getProductById);
router.post("/createproduct", authenticate, authorize("seller"), createProduct);
router.put("/updateproduct/:id", authenticate, authorize("seller"), updateProductById);
router.delete(
  "/deleteproduct/:id",
  authenticate,
  authorize("admin", "seller"),
  deleteProductById,
);

// export router
module.exports = router;
