import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/createOrder", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/adminGetAllOrder", protect, getAllOrders);
router.put("/adminUpdateOrderStatus/:orderId", protect, updateOrderStatus);

export default router;
