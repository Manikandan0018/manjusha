// orderController.js
import Order from "../models/Order.js";
import MyCartModel from "../models/MyCart.js";
import { v2 as cloudinary } from 'cloudinary';

export const createOrder = async (req, res) => {
  try {
    const { shippingInfo, totalPrice } = req.body;

    const cartDocs = await MyCartModel.find({ user: req.user._id });

    if (!cartDocs.length) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // ✅ Upload each image to Cloudinary if not already a URL
    const cartItems = await Promise.all(
      cartDocs.map(async (item) => {
        let imageUrl = item.image;

        if (!imageUrl.startsWith("http")) {
          const uploadRes = await cloudinary.uploader.upload(imageUrl, {
            folder: "orders",
          });
          imageUrl = uploadRes.secure_url;
        }

        return {
          name: item.name,
          price: parseFloat(item.price.replace(/[^\d.]/g, "")),
          image: imageUrl,
          quantity: item.quantity || 1,
          orderDate: item.orderDate,
          expectedDelivery: item.expectedDelivery, // ✅ keep from cart
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      cartItems,
      shippingInfo,
      totalPrice,
      status: "Preparing",
      orderDate: new Date(), // ✅ ensure order date
      expectedDelivery: cartDocs[0]?.expectedDelivery || null, // ✅ fallback
    });

    await MyCartModel.deleteMany({ user: req.user._id });

    console.log("🛒 Final Cart Items for Order:", cartItems);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ createOrder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullName email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, expectedDelivery } = req.body;

    const updateData = { status: orderStatus };
    if (expectedDelivery) updateData.expectedDelivery = expectedDelivery; // ✅ allow updating delivery date

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
