import jwt from "jsonwebtoken";
import User from "../models/SignUp.js";
import asyncHandler from "express-async-handler";

// 🔒 Middleware to protect routes (check JWT in cookies or headers)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // ✅ Else check for token in headers (Bearer token)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ❌ No token found
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⚡ Check if it's admin
    if (decoded.isAdmin) {
      req.user = {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };
      return next();
    }

    // ✅ Otherwise normal user from DB
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});
