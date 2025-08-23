import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";

// ✅ Routes
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

import AdminLogin from "./routes/AdminLogin.js";

dotenv.config();

const app = express();

// ✅ Correct CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:5173" ||
        /\.vercel\.app$/.test(origin)   // ✅ regex check
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// ✅ Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.json());

// ✅ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Routes
app.use("/api/AdminProduct", AdminProductRoute);
app.use("/api/AdminMenProduct", AdminMenProductRoute);
app.use("/api/AdminWomenProduct", AdminWomenProductRoute);
app.use("/api/AdminChildProduct", AdminChildProductRoute);
app.use("/api/CartProduct", CartProduct);
app.use("/api", SignUp);
app.use("/api/MyCartProduct", MyCartProduct);
app.use("/api", Profile);
app.use("/api", OrderTracking);
app.use("/api/email", emailRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/admin", AdminDashboard);
app.use("/api", AdminLogin);


// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// ✅ DB connect + Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
