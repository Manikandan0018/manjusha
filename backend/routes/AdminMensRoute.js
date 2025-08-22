import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/AdminMensProduct.js";

const router = express.Router();

router.get("/AdminMenProductGet", getAllProducts);
router.post("/AdminMenProductCreate", createProduct);
router.put("/AdminMenProductUpdate/:id", updateProduct);
router.delete("/AdminMenProductDelete/:id", deleteProduct);

export default router;
