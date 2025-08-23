// routes/authRoutes.js
import express from "express";
import { loginAdmin } from "../controllers/AdminLogin.js";

const router = express.Router();

// POST /api/admin/login
router.post("/admin/login", loginAdmin);

export default router;
