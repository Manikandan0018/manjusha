import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/AdminProductController.js";

const router = express.Router();

router.get("/AdminGetProduct", getAllProducts);
router.post("/AdminCreateProduct", createProduct);
router.put("/AdminUpdateProduct/:id", updateProduct);
router.delete("/AdminDeleteProduct/:id", deleteProduct);

export default router;
