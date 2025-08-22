import { useState } from "react";
import { FaHeart, FaTruck, FaBolt, FaCrown, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Footer } from "../Footer.jsx";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

// Images
import men1 from "../menImageCategory/menAnotherCarousal1.jpg";
import men2 from "../menImageCategory/menCarousal3.jpg";
import men3 from "../menImageCategory/menCarousal2.jpg";
import men4 from "../menImageCategory/menCarousal1.jpg";
import banner from "../menImageCategory/menbanner.png";

import newp1 from "../menImageCategory/m1.jpg";
import newp2 from "../menImageCategory/m2.jpg";
import newp3 from "../menImageCategory/m3.jpg";
import newp4 from "../menImageCategory/m4.jpg";
import newp5 from "../menImageCategory/m5.jpg";
import newp6 from "../menImageCategory/m6.jpg";
import newp7 from "../menImageCategory/m7.jpg";
import newp8 from "../menImageCategory/m8.jpg";
import newp9 from "../menImageCategory/m9.jpg";

// Local demo products
const products = [
  { name: "Elegant Evening Gown", price: "₹2,999", image: newp1 },
  { name: "Casual Denim Jacket", price: "₹1,499", image: newp2 },
  { name: "Summer Floral Dress", price: "₹1,199", image: newp3 },
  { name: "Classic Black Blazer", price: "₹2,299", image: newp4 },
  { name: "Elegant Evening Gown", price: "₹2,999", image: newp5 },
  { name: "Casual Denim Jacket", price: "₹1,499", image: newp6 },
  { name: "Summer Floral Dress", price: "₹1,199", image: newp7 },
  { name: "Classic Black Blazer", price: "₹2,299", image: newp8 },
  { name: "Classic Black Blazer", price: "₹1,299", image: newp9 },
];

// Carousel demo products
const mensProducts = [
  { id: 1, name: "Premium Blazer", price: "₹3,499", image: men1 },
  { id: 2, name: "Denim Jacket", price: "₹2,199", image: men2 },
  { id: 3, name: "Casual Shirt", price: "₹999", image: men3 },
  { id: 4, name: "Sporty Hoodie", price: "₹1,299", image: men4 },
];

const API_URL = `${VITE_BACKEND_URL}api/AdminMenProduct`;

export const MensCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState([]);

  const toggleLike = (index) => {
    setLiked((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Fetch backend products
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => (await axios.get(`${API_URL}/AdminMenProductGet`)).data,
  });

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(`${VITE_BACKEND_URL}api/MyCartProduct/getMyCart`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  // Mutation for add to cart
  const addCartProduct = useMutation({
    mutationFn: (data) =>
      axios.post(`${VITE_BACKEND_URL}api/MyCartProduct/addMyCart`, data, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  const handleAddToCart = (product) => {
    const payload = {
      name: product.name || product.title,
      price: product.price,
      description: product.description || "",
      image: product.image,
    };

    const alreadyExists = cartItems.some(
      (item) => item.name === payload.name && item.image === payload.image
    );

    if (alreadyExists) {
      toast.info("Product already added to cart", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    addCartProduct.mutate(payload, {
      onSuccess: () => {
        toast.success("Product added to cart");
        navigate("/cart");
      },
      onError: () => {
        toast.error("Failed to add product");
      },
    });
  };

  const gotoCart = () => {
    navigate("/cart");
  };

  return (
    <>
      {/* Navbar */}
      <div className="bg-white px-4 md:px-6 py-4 shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-rose-600">Efyer</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-2/5">
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) navigate(selected);
            }}
            className="border border-rose-300 px-3 py-2 rounded bg-rose-50 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
          >
            <option value="">All Category</option>
            <option value="/menCategory">Men Product</option>
            <option value="/womenCategory">Women Product</option>
            <option value="/childCategory">Child Product</option>
          </select>

          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-300 px-4 py-2 text-sm rounded-l-md"
            />
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-sm rounded-r-md shadow-md transition">
              🔍
            </button>
          </div>
        </div>

        <div
          onClick={gotoCart}
          className="relative flex items-center text-gray-700 hover:text-rose-600 cursor-pointer"
        >
          <span className="text-xl">🛒</span>
          <span className="ml-1 text-sm font-medium hidden sm:inline">Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Banner */}
      <div className="w-full">
        <img src={banner} alt="Banner" className="w-full h-auto object-cover" />
      </div>

      {/* Swiper Section */}
      <section className="py-14 px-4 bg-gradient-to-br from-rose-50 via-white to-rose-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Men's Top Picks</h2>
          <p className="text-rose-500 text-lg mt-2 italic">Elevate your style game</p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="px-4"
        >
          {mensProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative rounded-xl overflow-hidden shadow-xl group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6 flex flex-col justify-end">
                  <motion.h3
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl font-semibold mb-1"
                  >
                    {product.name}
                  </motion.h3>
                  <p className="text-rose-400 font-bold text-lg mb-4">{product.price}</p>
                  <motion.button
                    onClick={() => handleAddToCart(product)}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-md text-sm font-medium shadow-md transition"
                  >
                    Shop Now <FaArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Product Grid */}
      <section className="bg-white py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-8">Men's Fashion</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-rose-200 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.03] relative"
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                onClick={() => toggleLike(index)}
              >
                <FaHeart
                  className={`text-lg ${liked.includes(index) ? "fill-rose-500" : ""}`}
                />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-rose-600 font-bold">{product.price}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full text-rose-700">
                    <FaTruck className="text-sm" /> Free Delivery
                  </span>
                  <span className="flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full text-rose-700">
                    <FaBolt className="text-sm" /> Fast Delivery
                  </span>
                  <span className="flex items-center gap-1 bg-rose-100 px-2 py-0.5 rounded-full text-rose-700">
                    <FaCrown className="text-sm" /> Prime
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md text-sm shadow-md transition"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Backend Products */}
      <section className="bg-white py-10 px-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-rose-200 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.03] relative"
              >
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-500"
                  onClick={() => toggleLike(index)}
                >
                  <FaHeart
                    className={`text-lg ${liked.includes(index) ? "fill-rose-500" : ""}`}
                  />
                </button>
                <img
                  src={todo.image}
                  alt={todo.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{todo.title}</h3>
                  <p className="text-gray-600">{todo.description}</p>
                  <p className="text-rose-600 font-bold">{todo.price}</p>
                  <button
                    onClick={() => handleAddToCart(todo)}
                    className="mt-3 w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md text-sm shadow-md transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
      <ToastContainer />
    </>
  );
};
