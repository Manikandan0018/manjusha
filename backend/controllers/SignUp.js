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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2️⃣ Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3️⃣ Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // 4️⃣ Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 5️⃣ Return role to frontend
    res.status(200).json({
      message: 'Login successful',
      role: user.isAdmin ? "admin" : "user",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
// GET /api/me
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -confirmPassword");
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 👇 send user object directly (not wrapped in { user })
    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

