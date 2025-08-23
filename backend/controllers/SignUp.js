import User from '../models/SignUp.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// POST /api/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, isAdmin } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({
      fullName,
      email,
      password,
      isAdmin: isAdmin || false, // optional admin flag
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // ✅ Admin Login (from .env)
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email, isAdmin: true }, // 👈 include isAdmin flag
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.json({ message: "Admin logged in", isAdmin: true });
  }

  // ✅ Normal User Login (from MongoDB)
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign(
      { id: user._id, isAdmin: false }, // 👈 normal user
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.json({ message: "User logged in", isAdmin: false });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// POST /api/logout
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/me
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -confirmPassword");
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
