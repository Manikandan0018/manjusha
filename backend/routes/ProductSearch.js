// routes/deliveryRoutes.js
import express from "express";
import { getExpectedDelivery } from "../controllers/ProductSearch.js";
const router = express.Router();

router.get("/search", getExpectedDelivery);

export default router;
