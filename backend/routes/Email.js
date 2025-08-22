import express from "express";
import { sendEmail } from "../controllers/Email.js";

const router = express.Router();

// POST → /api/email/send
router.post("/sendEmail", sendEmail);

export default router;
