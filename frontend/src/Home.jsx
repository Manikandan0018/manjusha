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

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// === Fetch user info from backend ===
const fetchUser = async () => {
  const res = await axios.get(`${VITE_BACKEND_URL}api/me`, {
    withCredentials: true,
  });
  return res.data.user;
};

// === Fetch cart ===
const fetchCart = async () => {
  const res = await axios.get(`${VITE_BACKEND_URL}api/MyCartProduct/getMyCart`, {
    withCredentials: true,
  });
  return res.data;
};

// === Fetch products by search ===
const fetchProducts = async (search) => {
  if (!search) return [];
  const res = await axios.get(`${VITE_BACKEND_URL}api/products/search?q=${search}`);
  return res.data;
};

export const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // actual query when button clicked

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  // Get logged-in user
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: fetchUser });

  // Get cart
  const { data: cartItems = [] } = useQuery({ queryKey: ["cart"], queryFn: fetchCart });

  // Get products by search
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => fetchProducts(searchQuery),
    enabled: !!searchQuery,
  });

  const gotoCart = () => navigate("/cart");

  const logout = async () => {
    try {
      await axios.post(`${VITE_BACKEND_URL}api/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search); // trigger query
  };

  return (
    <div className="font-sans bg-white text-rose-700 relative">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleSidebar}
        ></div>
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
            <button onClick={() => navigate("/login")} className="text-sm text-rose-600">
              Login
            </button>
          )}

          {user && (
            <button onClick={logout} className="text-left text-rose-600">
              Logout
            </button>
          )}

          <button onClick={() => navigate("/Favourite")} className="text-left text-rose-600">
            Favourite
          </button>
          <button onClick={() => navigate("/email")} className="text-left text-rose-600">
            Support
          </button>
          <button onClick={() => navigate("/order-tracking")} className="text-left text-rose-600">
            Order History
          </button>
          <button onClick={() => navigate("/AdminLogin")} className="text-rose-600">
            Admin
          </button>
          <button onClick={() => navigate("/profile")} className="text-left text-rose-600">
            Settings
          </button>

          <button onClick={toggleSidebar} className="text-left text-rose-400 mt-4">
            Close
          </button>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white px-4 md:px-6 py-4 shadow w-full">
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          <img src={logo} alt="Efyer Logo" className="h-12 object-contain" />

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-md mx-auto overflow-hidden rounded-full shadow-md"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-3 text-sm text-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-rose-500 px-6 py-3 text-white font-semibold hover:bg-rose-600 transition"
            >
              🔍
            </button>
          </form>

          {/* Cart & User */}
          <div className="flex items-center gap-4">
            <div onClick={gotoCart} className="relative cursor-pointer text-rose-700">
              🛒
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </div>

            {user ? (
              <span className="text-sm text-rose-600 font-semibold">👋 Hi, {user.fullName}</span>
            ) : (
              <button onClick={() => navigate("/login")} className="text-sm text-rose-600">
                Login
              </button>
            )}

            {user && (
              <button onClick={logout} className="text-sm text-rose-600">
                Logout
              </button>
            )}
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
        <div className="bg-white/70 p-6 rounded-xl">
          <h2 className="text-4xl font-bold mb-3">GET START</h2>
          <h3 className="text-3xl font-bold mb-6">YOUR FAVORITE SHOPPING</h3>
          <button className="bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600">
            BUY NOW
          </button>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
          {loadingProducts ? (
            <p>Loading...</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="border p-3 rounded-lg shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="mt-2 font-semibold">{product.name}</h3>
                  <p className="text-gray-500">${product.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
      )}

      {/* Existing content */}
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold text-rose-700">Woman Fashion</h2>
      </div>

      <img src={midbanner} alt="" />
      <LaunchNew />
      <div className="flex justify-center w-full bg-rose-50 px-4 py-6">
        <img src={midbanner2} alt="banner" className="w-full max-w-6xl h-auto" />
      </div>
      <Footer />
    </div>
  );
};
