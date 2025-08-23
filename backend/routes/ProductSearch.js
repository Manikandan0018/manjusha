// routes/deliveryRoutes.js
import express from "express";
import { search } from "../controllers/ProductSearch.js";
const router = express.Router();

router.get("/search", search);

export default router;
