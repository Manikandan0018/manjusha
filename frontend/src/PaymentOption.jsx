import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const PaymentOption = () => {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Fetch cart items of the logged-in user
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/MyCartProduct/getMyCart", {
          withCredentials: true,
        });
        setCartItems(res.data);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    fetchCart();
  }, []);

  const handleProceed = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/createOrder",
        { items: cartItems }, // Only send items, backend gets user from session
        { withCredentials: true }
      );

      setOrderConfirmed(true);
      setTimeout(() => {
        navigate("/order-tracking");
      }, 2500);
    } catch (err) {
      console.error("Order creation failed", err);
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-xl animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💳 Payment Options</h2>

      <label className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-all duration-200">
        <div className="flex items-center gap-3 text-gray-700 font-medium">
          <input
            type="radio"
            name="payment"
            value="cod"
            defaultChecked
            className="accent-orange-500 w-5 h-5"
          />
          <span className="text-base">💵 Cash on Delivery</span>
        </div>
      </label>

      <button
        onClick={handleProceed}
        className="btn-animated w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:shadow-md transition duration-300 ease-in-out"
      >
        🔐 Proceed to Payment
      </button>

      {orderConfirmed && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-2xl animate-bounceIn z-20">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Confirmed!</h3>
          <p className="text-sm text-gray-600">Redirecting to tracking page...</p>
        </div>
      )}
    </div>
  );
};
