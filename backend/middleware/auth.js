import jwt from "jsonwebtoken";
import User from "../models/SignUp.js";
import asyncHandler from "express-async-handler";

// 🔒 Middleware to protect routes (check JWT in cookies or headers)
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token || (req.headers.authorization?.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.isAdmin
      ? { email: decoded.email, isAdmin: true } // 👈 Admin (not in DB)
      : await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

