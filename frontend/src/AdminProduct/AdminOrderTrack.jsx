import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

const fetchUser = async () => {
  const res = await axios.get(`${VITE_BACKEND_URL}api/me`, {
    withCredentials: true,
  });
  return res.data;
};

export const AdminOrderTrack = () => {
  const [orders, setOrders] = useState([]);
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/adminGetAllOrder`, { withCredentials: true })
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${VITE_BACKEND_URL}api/adminUpdateOrderStatus/${orderId}`,
        { orderStatus: newStatus },
        { withCredentials: true }
      );
      const res = await axios.get(`${VITE_BACKEND_URL}api/adminGetAllOrder`, {
        withCredentials: true,
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <motion.h1
        className="text-3xl font-extrabold mb-8 text-center text-orange-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Order Management
      </motion.h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-10">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              className="rounded-xl bg-white shadow-lg p-6 border-l-4 border-orange-500"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Order #{order._id.slice(-6)}</h2>
                <span className="px-2 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">Customer: {order.user?.fullName || "Unknown"}</p>
              <p className="text-sm text-gray-600 mb-2">Email: {order.user?.email}</p>

              <div className="text-sm text-gray-700 mb-4">
                <strong>Shipping:</strong> {user?.shippingAddress?.address}, {user?.shippingAddress?.city}, {user?.shippingAddress?.state}, {user?.shippingAddress?.zip}, {user?.shippingAddress?.country}
              </div>

              <div className="grid gap-4">
                {order.cartItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-t pt-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="ml-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-orange-200"
                >
                  <option value="Preparing">Preparing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderTrack;
