import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/AdminChildrensProduct.js";

const router = express.Router();

router.get("/AdminChildProductGet", getAllProducts);
router.post("/AdminChildProductCreate", createProduct);
router.put("/AdminChildProductUpdate/:id", updateProduct);
router.delete("/AdminChildProductDelete/:id", deleteProduct);

export default router;
