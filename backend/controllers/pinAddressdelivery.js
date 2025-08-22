// controllers/deliveryController.js
import axios from "axios";

const ZIPCODEBASE_API_KEY = "d9962580-7d9b-11f0-bbd4-a345c2998a73";
const WAREHOUSE_PIN = "626126"; // Kalasalingam Academy

export const getExpectedDelivery = async (req, res) => {
  try {
    const { pincode } = req.params;

    console.log("Received pincode:", pincode);

    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ message: "Invalid pincode" });
    }

    // Call Zipcodebase API
    const response = await axios.get(
      `https://app.zipcodebase.com/api/v1/distance?apikey=${ZIPCODEBASE_API_KEY}&code=${WAREHOUSE_PIN}&compare=${pincode}&country=IN`
    );

    console.log("Zipcodebase API raw response:", response.data);

    // Correctly extract distance
    const distance = response.data?.results?.[pincode];

    if (distance === undefined) {
      return res.status(400).json({ message: "Distance not found for this pincode" });
    }

    // Determine delivery days based on distance
    let days;
    if (distance <= 50) days = 2;
    else if (distance <= 150) days = 4;
    else if (distance <= 250) days = 7;
    else if (distance <= 350) days = 9;
    else if (distance > 500) days = 14;
    else days = 5;

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + days);

    res.json({
      distance: Math.round(distance),
      days,
      expectedDelivery,
    });
  } catch (error) {
    console.error("❌ Error calculating delivery:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to calculate delivery",
    });
  }
};
