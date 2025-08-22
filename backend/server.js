import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser"; // ✅ added
import { v2 as cloudinary } from "cloudinary";

import bodyParser from "body-parser";
import emailRoutes from "./routes/Email.js";

import deliveryRoutes from "./routes/pinAdressDelivery.js";
import favouriteRoutes from "./routes/Favourite.js";

import AdminDashboard from "./routes/AdminDashboard.js";

// ✅ Route imports
import AdminProductRoute from "./routes/AdminProductRoute.js";
import AdminMenProductRoute from "./routes/AdminMensRoute.js";
import AdminWomenProductRoute from "./routes/AdminWomenRoute.js";
import AdminChildProductRoute from "./routes/AdminChildRoute.js";
import CartProduct from "./routes/AddCartRoute.js";
import SignUp from "./routes/SignUp.js";
import MyCartProduct from "./routes/MyCartRoute.js";
import Profile from "./routes/Profile.js";
import  OrderTracking  from "./routes/OrderRoute.js";
dotenv.config();

const app = express();

// ✅ Use middleware in correct order
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server requests

    const allowedOrigins = [
      'http://localhost:5173',
      /\.vercel\.app$/
    ];

    if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser()); // ✅ must come before protect()
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



// ✅ Connect DB & start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
