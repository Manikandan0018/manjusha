import Order from "../models/Order.js";
import User from "../models/SignUp.js";

// 📊 Get Admin Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    // Start of week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Orders
    const weeklyOrders = await Order.countDocuments({ createdAt: { $gte: startOfWeek } });
    const monthlyOrders = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Users
    const weeklyUsers = await User.countDocuments({ createdAt: { $gte: startOfWeek } });
    const monthlyUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({ weeklyOrders, monthlyOrders, weeklyUsers, monthlyUsers });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
