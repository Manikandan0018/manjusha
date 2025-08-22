// routes/deliveryRoutes.js
import express from "express";
import { getExpectedDelivery } from "../controllers/pinAddressdelivery.js";
const router = express.Router();

router.get("/expected-delivery/:pincode", getExpectedDelivery);

export default router;
