import express from "express";
import { updateProfile } from "../controllers/Profile.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

// PATCH route to update user profile
router.put("/profile/update", protect, updateProfile);

export default router;
