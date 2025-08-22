import express from "express";
import { addFavourite, getFavourites, removeFavourite } from "../controllers/Favourite.js";
import { protect } from "../middleware/auth.js"; // ✅ your auth middleware

const router = express.Router();

router.post("/add", protect, addFavourite);
router.get("/myfavourites", protect, getFavourites);
router.delete("/remove/:productId", protect, removeFavourite);


export default router;
