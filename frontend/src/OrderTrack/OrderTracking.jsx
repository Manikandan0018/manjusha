import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, PackageSearch, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../eLogo.png";
import { Truck } from "lucide-react";  // modern delivery icon

const fetchUser = async () => {
  const res = await axios.get("http://localhost:5000/api/me", {
    withCredentials: true,
  });
  return res.data;
};

// Order Tracker Component
const statusSteps = ["Preparing", "Shipped", "Out for Delivery", "Delivered"];

const OrderTracker = ({ currentStatus, history }) => {
  const currentIndex = statusSteps.findIndex(
    (s) => s.toLowerCase() === currentStatus.toLowerCase()
  );

  return (
    <div className="mt-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between relative">
        {statusSteps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.4 }}
                className={`rounded-full w-10 h-10 flex items-center justify-center ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isActive ? <CheckCircle className="w-6 h-6" /> : index + 1}
              </motion.div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step}
              </span>

              {/* Connector line */}
              {index < statusSteps.length - 1 && (
                <div className="absolute top-5 left-0 right-0 h-1">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                    className="h-1 bg-green-500"
                  />
                  <div className="h-1 bg-gray-200 absolute w-full top-0 left-0 -z-10"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="mt-6 space-y-3">
        {history?.map((h, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-sm text-gray-600"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                h.status.toLowerCase() === currentStatus.toLowerCase()
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
            <span className="font-medium">{h.status}</span>
            <span className="text-gray-400 text-xs">{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};



const API_URL = "http://localhost:5000/api/AdminProduct";

const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/AdminGetProduct`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};



export const OrderTracking = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });


   const { data: products = [], isLoading } = useQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
    });


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/myOrders", { withCredentials: true })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:5000/api/MyCartProduct/getMyCart",
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data?.message || "Logout failed");
    }
  };

  const gotoCart = () => navigate("/cart");

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          {user ? (
            <span className="text-sm text-rose-600 font-semibold block">
              👋 Hi, {user.fullName}
            </span>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-rose-500 hover:underline block"
            >
              Login
            </button>
          )}

          {user && (
            <button onClick={logout} className="text-left text-rose-500">
              Logout
            </button>
          )}
          <button
            onClick={() => {
              navigate("/support");
              toggleSidebar();
            }}
            className="text-left text-rose-500"
          >
            Support
          </button>
          <button
            onClick={() => {
              navigate("/order-tracking");
              toggleSidebar();
            }}
            className="text-left text-rose-500"
          >
            Order History
          </button>
          <button
            onClick={() => {
              navigate("/profile");
              toggleSidebar();
            }}
            className="text-left text-rose-500"
          >
            Settings
          </button>
          <button
            onClick={toggleSidebar}
            className="text-left text-gray-500 mt-4"
          >
            Close
          </button>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white px-4 md:px-6 py-4 shadow w-full">
        {/* Mobile Navbar */}
        <div className="flex items-center justify-between md:hidden">
          <button
            className="text-2xl text-gray-700 hover:text-rose-500"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-8 object-contain" />
          </div>
          <div
            onClick={gotoCart}
            className="relative cursor-pointer text-gray-700 hover:text-rose-500"
          >
            <span className="text-xl">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain" />

          <div className="flex gap-4 items-center w-full md:w-2/5">
            <select
              onChange={(e) => e.target.value && navigate(e.target.value)}
              className="border border-rose-300 px-3 py-2 rounded bg-rose-50 text-sm"
            >
              <option value="">All Category</option>
              <option value="/menCategory">Men Product</option>
              <option value="/womenCategory">Women Product</option>
              <option value="/childCategory">Child Product</option>
            </select>
            <div className="flex w-full border border-rose-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-4 py-2 text-sm focus:outline-none bg-rose-50"
              />
              <button className="bg-rose-500 text-white px-4 py-2 text-sm hover:bg-rose-600 transition">
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              onClick={gotoCart}
              className="relative cursor-pointer flex items-center text-gray-700 hover:text-rose-500"
            >
              <span className="text-xl">🛒</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </div>
            {user ? (
              <span className="text-sm text-rose-600 font-semibold hidden lg:block">
                👋 Hi, {user.fullName}
              </span>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-rose-500 hover:underline hidden lg:block"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-rose-100 py-10 px-4">
        <h1 className="text-4xl font-bold text-rose-600 text-center mb-10">
          My Orders
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-rose-400">
            <Loader className="w-6 h-6 animate-spin mb-2" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-rose-300">
            <PackageSearch className="w-8 h-8 mb-2" />
            <p>No orders found yet.</p>
          </div>
        ) : (
          <div className="space-y-8 shadow max-w-6xl mx-auto">



            
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-2xl border border-rose-100 rounded-2xl  p-6"
              >
                {/* Order Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-rose-700">
                    Order ID : #{order._id.slice(-6)}
                  </h3>

                  {/* Order Date */}
                  <p className="text-sm text-gray-500">
                    📅 Ordered On:{" "}
                    <span className="font-medium text-gray-700">
                      {new Date(order.orderDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>

               

                  {/* Status */}
                  <p className="text-sm text-rose-500 mt-1">
                    Status:{" "}
                    <span className="text-rose-600 font-medium">
                      {order.status}
                    </span>
                  </p>
                </div>

          

               

                {/* Animated Order Tracker */}
                <OrderTracker
                  currentStatus={order.status}
                  history={order.history}
                />

                {/* Order Items */}
                <div className="grid shadow-2xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
                  {order.cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm hover:scale-105 transform transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full object-cover rounded mb-3"
                      />
                      <div>
                        <p className="font-medium text-rose-800">{item.name}</p>
                        <p className="text-sm text-rose-500">₹{item.price}</p>
                        <p className="text-sm text-rose-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-2 text-sm text-rose-600 font-semibold text-right">
                          Total: ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>


                               {/* Expected Delivery */}
   <div className="space-y-3">
  <div className="border rounded-2xl p-4 bg-gradient-to-r from-rose-50 to-white shadow-md hover:shadow-lg transition">
    
    {/* Header */}
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 bg-rose-100 rounded-full">
        <Truck className="h-5 w-5 text-rose-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700">Expected Delivery</h3>
    </div>

    {/* Delivery Date */}
    <p className="text-base font-medium text-gray-800">
      {order.expectedDelivery ? (
        <span className="text-rose-600">
          {new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ) : (
        <span className="text-gray-400">Updating...</span>
      )}
    </p>

    {/* Subtext */}
    <p className="text-xs text-gray-500 mt-2">
      📦 Your order is being processed. We’ll notify you when it’s Deliver!
    </p>
  </div>
</div>
                    </div>

                    
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderTracking;
