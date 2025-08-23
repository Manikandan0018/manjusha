import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import midbanner from './womenNewProduct-Images/banner.jpg'
import midbanner2 from './womenNewProduct-Images/banner2.jpg'

import { LaunchNew } from "./LaunchNew.jsx";
import { Footer } from "./Footer";
import logo from "./eLogo.png";
import banner from "./c1.jpg";
import ban1 from "./ban1.png";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

// === Fetch user info from backend ===
const fetchUser = async () => {
  const res = await axios.get(`${VITE_BACKEND_URL}api/me`, {
    withCredentials: true,
  });
  return res.data.user; // ✅ return just the user object
};


export const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  // Get logged-in user info
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  // Get cart items
  const {
    data: cartItems = [],
  } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(`${VITE_BACKEND_URL}api/MyCartProduct/getMyCart`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const gotoCart = () => navigate("/cart");

  const logout = async () => {
    try {
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/logout`,
        {},
        { withCredentials: true }
      );
      console.log(res.data.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Logout failed";
      console.error(errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="font-sans bg-white text-rose-700 relative">
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* === Sidebar === */}
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
              className="text-sm text-rose-600 hover:underline block"
            >
              Login
            </button>
          )}

          {!user && (
            <button
              onClick={() => {
                navigate("/login");
                toggleSidebar();
              }}
              className="text-left text-rose-600"
            >
              Login
            </button>
          )}

          {user && (
            <button
              onClick={async () => {
                toggleSidebar();
                await logout();
              }}
              className="text-left text-rose-600"
            >
              Logout
            </button>
            
          )}
             <button
              onClick={() => {
                navigate("/Favourite");
                toggleSidebar();
              }}
              className="text-left text-rose-600"
            >
              Favourite
            </button>

          <button
            onClick={() => {
              navigate("/email");
              toggleSidebar();
            }}
            className="text-left text-rose-600"
          >
            Support
          </button>
          <button
            onClick={() => {
              navigate("/order-tracking");
              toggleSidebar();
            }}
            className="text-left text-rose-600"
          >
            Order History
          </button>

           <button
              onClick={() => navigate("/AdminLogin")}
              className="cursor-pointer text-rose-600 hover:underline hidden lg:block"
            >
              Admin
            </button>
            
          <button
            onClick={() => {
              navigate("/profile");
              toggleSidebar();
            }}
            className="text-left text-rose-600"
          >
            Settings
          </button>
          
           
          
          
          <button
            onClick={toggleSidebar}
            className="text-left text-rose-400 mt-4"
          >
            Close
          </button>
        </div>
      </div>

      {/* === Navbar === */}
      <div className="bg-white px-4 md:px-6 py-4 shadow w-full">
        {/* === Mobile Navbar === */}
        <div className="flex items-center justify-between md:hidden">
          <button
            className="text-2xl text-rose-700 hover:text-rose-600"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Efyer Logo" className="h-8 object-contain" />
          </div>
          <div
            onClick={gotoCart}
            className="relative cursor-pointer text-rose-700 hover:text-rose-600"
          >
            <span className="text-xl">🛒</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>

        {/* === Search (Mobile) === */}
        <div className="mt-3 mb-1 md:hidden">
          <div className="flex items-center border border-rose-200 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search for anything"
              className="flex-1 bg-transparent text-sm placeholder-rose-400 focus:outline-none"
            />
            <button className="text-xl text-rose-700 hover:text-rose-600">
              🔍
            </button>
          </div>
        </div>

        {/* === Desktop Navbar === */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          <img
            src={logo}
            alt="Efyer Logo"
            className="h-10 md:h-12 object-contain"
          />

          <div>
            <p
              onClick={() => navigate("/AdminLogin")}
              className="cursor-pointer text-rose-600 hover:underline hidden lg:block"
            >
              Admin
            </p>
          </div>

          {/* Search & Category */}
          <div className="flex flex-row gap-2 w-full md:w-2/5">
            {/* <select
              onChange={(e) => {
                const selected = e.target.value;
                if (selected) navigate(selected);
              }}
              className="border border-rose-200 px-3 py-2 rounded bg-rose-50 text-sm"
            >
              <option value="">All Category</option>
              <option value="/menCategory">Men Product</option>
              <option value="/womenCategory">Women Product</option>
              <option value="/childCategory">Child Product</option>
            </select> */}
       <div className="flex w-full max-w-md mx-auto overflow-hidden rounded-full shadow-md">
  <input
    type="text"
    placeholder="Search for products..."
    className="flex-1 px-6 py-3 text-sm text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 placeholder-gray-400 transition-all duration-300"
  />
  <button className="bg-rose-500 px-6 py-3 text-white text-sm font-semibold hover:bg-rose-600 hover:scale-105 transition-all duration-300">
    🔍
  </button>
</div>

          </div>

          {/* Cart & User */}
          <div className="flex items-center gap-4">
            <div
              onClick={gotoCart}
              className="relative flex items-center text-rose-700 hover:text-rose-600 cursor-pointer"
            >
              <span className="text-xl">🛒</span>
              <span className="ml-1 text-sm font-medium hidden sm:inline">
                Cart
              </span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </div>

            {/* Show username or login button */}
            {user ? (
              <span className="text-sm text-rose-600 font-semibold hidden lg:block">
                👋 Hi, {user.fullName}
              </span>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-rose-600 hover:underline hidden lg:block"
              >
                Login
              </button>
            )}

            {user && (
              <button
                onClick={logout}
                className="text-sm text-rose-600 hover:underline hidden lg:block"
              >
                Logout
              </button>
            )}

               <button
              onClick={() => {
                navigate("/favourite");
                toggleSidebar();
              }}
              className="text-left text-rose-600"
            >
              Favourite
            </button>

            <button
              onClick={() => navigate("/email")}
              className="text-sm text-rose-600 hover:underline hidden lg:block"
            >
              Support
            </button>
            <button
              onClick={() => navigate("/order-tracking")}
              className="text-sm text-rose-600 hover:underline hidden lg:block"
            >
              Order History
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-sm text-rose-600 hover:underline hidden lg:block"
            >
              Settings
            </button>
           
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-rose-700 text-center"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/70 p-6 sm:p-10 rounded-xl backdrop-blur-md">
          <h2 className="text-4xl sm:text-6xl font-bold mb-3">GET START</h2>
          <h3 className="text-3xl sm:text-5xl font-bold mb-6">
            YOUR FAVORITE SHOPPING
          </h3>
          <button className="bg-rose-500 text-white py-3 px-6 rounded text-lg hover:bg-rose-600 transition">
            BUY NOW
          </button>
        </div>
      </section>

      {/* Fashion Title */}
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold text-rose-700">Woman Fashion</h2>
      </div>

      <img src={midbanner} alt="" />

      <LaunchNew />

      {/* Banner */}
      <div className="flex justify-center w-full bg-rose-50 px-4 py-6 md:px-12 lg:px-24">
  <img
    src={midbanner2}
    alt="banner"
    className="w-full max-w-6xl h-auto object-contain 
               md:h-80 lg:h-96 xl:h-[500px]"
  />
</div>


      <Footer  />
    </div>
  );
};
