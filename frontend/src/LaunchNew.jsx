import { useEffect, useState } from "react";
import { FaHeart, FaTruck, FaBolt, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

// Fetch products
const fetchProducts = async () => {
  const res = await fetch(`${VITE_BACKEND_URL}api/AdminProduct/AdminGetProduct`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const LaunchNew = ({ search = "" }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [liked, setLiked] = useState([]); // store favourite products locally

  // Fetch logged-in user
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(
        `${VITE_BACKEND_URL}api/MyCartProduct/getMyCart`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  // ✅ Fetch favourite items from backend
  const { data: favouriteItems = [] } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      const res = await axios.get(
        `${VITE_BACKEND_URL}api/favourites/myfavourites`,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setLiked(data.map((f) => f.product)); // sync with local liked state
    },
  });

  // Add to cart mutation
  const addCartProduct = useMutation({
    mutationFn: (data) =>
      axios.post(`${VITE_BACKEND_URL}api/MyCartProduct/addMyCart`, data, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
    },
  });

  // Add favourite
  const addFavourite = useMutation({
    mutationFn: (productId) =>
      axios.post(
        `${VITE_BACKEND_URL}api/favourites/add`,
        { productId },
        { withCredentials: true }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["favourites"]);
      toast.success("Added to favourites ❤️");
    },
    onError: (err) => {
      if (err.response?.data?.message === "Already in favourites") {
        toast.info("Already in favourites");
      } else {
        toast.error("Failed to add favourite");
      }
    },
  });

  // Remove favourite
  const removeFavourite = useMutation({
    mutationFn: (productId) =>
      axios.delete(`${VITE_BACKEND_URL}api/favourites/remove/${productId}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["favourites"]);
      toast.success("Removed from favourites 💔");
    },
  });

  // ✅ Final toggle like (uses product, not index)
  const toggleLike = (product) => {
    if (liked.some((p) => p._id === product._id)) {
      removeFavourite.mutate(product._id);
      setLiked((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      addFavourite.mutate(product._id);
      setLiked((prev) => [...prev, product]);
    }
  };

  // Add to cart handler
  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("User data not loaded yet");
      return;
    }

    const payload = {
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image,
      quantity: 1,
      shippingAddress: {
        address: user.shippingAddress?.address,
        city: user.shippingAddress?.city,
        state: user.shippingAddress?.state,
        zip: user.shippingAddress?.zip, // 👈 important for zipcodebase API
      },
    };

    // Prevent duplicate
    const alreadyExists = cartItems.some(
      (item) => item.name === payload.name && item.image === payload.image
    );
    if (alreadyExists) {
      toast.info("Product already added to cart");
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

  // ✅ Apply search filter (case insensitive)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white py-10 px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-center col-span-full">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-rose-100 rounded-lg shadow hover:shadow-md transition-transform hover:scale-[1.02] relative"
            >
              {/* Like Button */}
              <button
                className="absolute top-3 right-3 text-rose-400 hover:text-rose-500"
                onClick={() => toggleLike(product)}
              >
                <FaHeart
                  className={`text-lg ${
                    liked.some((p) => p._id === product._id)
                      ? "fill-rose-500"
                      : ""
                  }`}
                />
              </button>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-contain rounded-t-lg bg-white"
              />

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-rose-600 font-extrabold text-xl">
                  ₹{product.price}
                </p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <FaTruck className="text-sm text-rose-500" /> Free Delivery
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <FaBolt className="text-sm text-yellow-500" /> Fast Delivery
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <FaCrown className="text-sm text-purple-500" /> Prime
                  </span>
                </div>

                {/* Expected Delivery */}
                <div className="space-y-3 mt-2">
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    <p className="text-base font-semibold text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      🚚 Expected Delivery:{" "}
                      <span className="font-medium text-rose-600">
                        {product.expectedDelivery
                          ? new Date(
                              product.expectedDelivery
                            ).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Updating..."}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ToastContainer />
    </section>
  );
};
