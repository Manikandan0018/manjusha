import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/AdminWomensProduct.js";

const router = express.Router();

router.get("/AdminWomenProductGet", getAllProducts);
router.post("/AdminWomenProductCreate", createProduct);
router.put("/AdminWomenProductUpdate/:id", updateProduct);
router.delete("/AdminWomenProductDelete/:id", deleteProduct);

export default router;