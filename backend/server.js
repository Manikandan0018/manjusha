import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";

// ✅ Route imports
import emailRoutes from "./routes/Email.js";
import deliveryRoutes from "./routes/pinAdressDelivery.js";
import favouriteRoutes from "./routes/Favourite.js";
import AdminDashboard from "./routes/AdminDashboard.js";
import AdminProductRoute from "./routes/AdminProductRoute.js";
import AdminMenProductRoute from "./routes/AdminMensRoute.js";
import AdminWomenProductRoute from "./routes/AdminWomenRoute.js";
import AdminChildProductRoute from "./routes/AdminChildRoute.js";
import CartProduct from "./routes/AddCartRoute.js";
import SignUp from "./routes/SignUp.js";
import MyCartProduct from "./routes/MyCartRoute.js";
import Profile from "./routes/Profile.js";
import OrderTracking from "./routes/OrderRoute.js";

dotenv.config();

const app = express();

// ✅ CORS setup (allow Vercel + localhost)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://manjusha-bsrarz2eq-manikandan0018s-projects.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.json());

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ API Routes
app.use("/api/AdminProduct", AdminProductRoute);
app.use("/api/AdminMenProduct", AdminMenProductRoute);
app.use("/api/AdminWomenProduct", AdminWomenProductRoute);
app.use("/api/AdminChildProduct", AdminChildProductRoute);
app.use("/api/CartProduct", CartProduct);
app.use("/api", SignUp); // includes login/signup/logout
app.use("/api/MyCartProduct", MyCartProduct);
app.use("/api", Profile);
app.use("/api", OrderTracking);
app.use("/api/email", emailRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/admin", AdminDashboard);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// ✅ Connect DB & start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
