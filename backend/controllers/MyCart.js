import MyCartModel from "../models/MyCart.js";
import axios from "axios";

const ZIPCODEBASE_API_KEY = "d9962580-7d9b-11f0-bbd4-a345c2998a73";

// Helper for safe zipcode lookup with timeout + fallback
async function getDeliveryEstimate(zip) {
  try {
    const response = await axios.get(
      `https://app.zipcodebase.com/api/v1/search`,
      {
        params: { apikey: ZIPCODEBASE_API_KEY, codes: zip, country: "IN" },
        timeout: 3000, // ⏳ 3 sec timeout
      }
    );

    if (response.data?.results && response.data.results[zip]) {
      const city = response.data.results[zip][0].city;
      if (
        ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"].includes(city)
      ) {
        return 2; // Fast delivery cities
      }
    }
  } catch (err) {
    console.error("Zip lookup failed:", err.message);
  }
  return 5; // default if API fails
}

// ✅ Add product to cart
export const addMyCart = async (req, res) => {
  try {
    const { name, price, description, image, shippingAddress, quantity } =
      req.body;

    let estimatedDays = 5;

    if (shippingAddress?.zip) {
      estimatedDays = await getDeliveryEstimate(shippingAddress.zip);
    }

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + estimatedDays);

    const cartItem = await MyCartModel.create({
      user: req.user._id,
      name,
      price,
      description,
      image,
      shippingAddress,
      quantity,
      expectedDelivery,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// ✅ Get cart items
export const getMyCart = async (req, res) => {
  try {
    const cartItems = await MyCartModel.find({ user: req.user._id });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("❌ Error in getMyCart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await MyCartModel.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};
