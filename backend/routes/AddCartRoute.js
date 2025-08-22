import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../controllers/AddCartProduct.js";

const router = express.Router();

router.get("/CartProductGet", getAllProducts);
router.post("/CartProductCreate", createProduct);
router.delete("/CartProductDelete/:id", deleteProduct);

export default router;
