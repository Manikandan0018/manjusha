import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedImages, setSelectedImages] = useState({});
  const [deliveryEstimates, setDeliveryEstimates] = useState({});

  // ✅ Fetch cart items (includes shippingAddress)
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(
        `${VITE_BACKEND_URL}api/MyCartProduct/getMyCart`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  // ✅ Stable dependency: all zip codes concatenated
  const cartZips = cartItems.map((i) => i.shippingAddress?.zip || "").join(",");

  // ✅ Fetch delivery estimates whenever cart items or their zips change
  useEffect(() => {
    if (cartItems.length === 0) return;

    // Set default images
    const defaults = {};
    cartItems.forEach((item) => {
      defaults[item._id] = item.image;
    });
    setSelectedImages(defaults);

    // Fetch delivery estimates
    cartItems.forEach(async (item) => {
      const zip = item.shippingAddress?.zip;
      if (!zip) return;

      try {
        const res = await axios.get(
          `${VITE_BACKEND_URL}api/delivery/expected-delivery/${String(zip).trim()}`
        );
        setDeliveryEstimates((prev) => ({
          ...prev,
          [item._id]: res.data,
        }));
      } catch (err) {
        console.error("Delivery API failed for zip:", zip, err.message);
        // Show fallback in UI
        setDeliveryEstimates((prev) => ({
          ...prev,
          [item._id]: { distance: "N/A", days: "N/A", expectedDelivery: null },
        }));
      }
    });
  }, [cartItems, cartZips]); // ✅ cartZips is a stable dependency

  // ✅ Mutation for quantity update
  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }) => {
      const res = await axios.put(
        `${VITE_BACKEND_URL}api/MyCartProduct/updateQuantity/${id}`,
        { quantity },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["cartItems"]),
  });

  const handleQuantityChange = (id, newQty) => {
    updateQuantity.mutate({ id, quantity: newQty });
  };

  const handleBuyNow = () => {
    navigate("/Address");
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 text-gray-800">
      {isLoading ? (
        <p className="text-center text-lg font-semibold">Loading cart items...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-20 max-w-7xl mx-auto">
          {cartItems.map((product, idx) => (
            <div
              key={product._id}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b pb-8"
            >
              {/* LEFT: Image */}
              <div>
                <img
                  src={selectedImages[product._id]}
                  alt={product.name}
                  className="w-full h-auto rounded-lg shadow"
                />
              </div>

              {/* CENTER: Product Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <div className="text-red-600 font-bold text-lg">₹{product.price}</div>
                <p className="text-sm text-gray-700">Inclusive of all taxes</p>

                {/* Expected Delivery */}
                <div className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                  <p className="text-sm text-gray-600">
                    🚚 Expected Delivery:{" "}
                    <span className="font-medium text-blue-600">
                      {deliveryEstimates[product._id]?.expectedDelivery
                        ? new Date(
                            deliveryEstimates[product._id].expectedDelivery
                          ).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Checking..."}
                    </span>
                  </p>
                  {deliveryEstimates[product._id] && (
                    <p className="text-xs text-gray-500">
                      Distance: {deliveryEstimates[product._id].distance} km •{" "}
                      {deliveryEstimates[product._id].days} days
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT: Buy Box */}
              <div className="bg-white border rounded-lg shadow p-4 h-fit">
                <p className="text-2xl font-semibold mb-2">₹{product.price}</p>
                <p className="text-sm text-green-700">In Stock</p>

                {/* Quantity */}
                <div className="mb-4">
                  <label htmlFor={`qty-${idx}`} className="text-sm font-medium block mb-1">
                    Quantity
                  </label>
                  <select
                    id={`qty-${idx}`}
                    value={product.quantity || 1}
                    onChange={(e) =>
                      handleQuantityChange(product._id, Number(e.target.value))
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
