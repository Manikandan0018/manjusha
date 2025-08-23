import express from "express";
import Product from "../models/AdminProduct.js";

const router = express.Router();

// GET /api/products/search?q=keyword
export const search = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: "i" } },
            { description: { $regex: req.query.q, $options: "i" } },
            { category: { $regex: req.query.q, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find(keyword);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default router;
