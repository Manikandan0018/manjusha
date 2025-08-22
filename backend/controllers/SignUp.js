import User from '../models/SignUp.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    const user = new User({
      fullName,
      email,
      password,
    });
    user.confirmPassword = confirmPassword; // important!

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Login controller

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🚀 Login attempt received");
  console.log("👉 Email:", email);
  console.log("👉 Password:", password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found with this email.");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("✅ User found:", user.email);

    if (!user.matchPassword) {
      console.log("❌ matchPassword method not defined on user model.");
      return res.status(500).json({ message: "Server error: matchPassword not defined" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match.");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login successful. Token generated and cookie set.");
    res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


// POST /api/logout
export const logout =  (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax', // Or 'None' if using cross-site cookies
    secure: false,   // Set to true in production with HTTPS
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -confirmPassword");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(401).json({ message: 'Invalid token' });
  }
};