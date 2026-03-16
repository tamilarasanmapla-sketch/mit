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

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/create", authenticate, authorize("seller"), createProduct);
router.put("/:id", authenticate, authorize("seller"), updateProductById);
router.delete(
  "/:id",
  authenticate,
  authorize("seller"),
  deleteProductById,
);

// export router
module.exports = router;
