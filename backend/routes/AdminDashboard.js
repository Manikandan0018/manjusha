import express from "express";
import { getDashboardStats } from "../controllers/AdminDashboard.js";
import { protect } from "../middleware/auth.js"; // ensure only admin can see

const router = express.Router();

// ✅ Only admin can view stats
router.get("/stats", protect, getDashboardStats);

export default router;
