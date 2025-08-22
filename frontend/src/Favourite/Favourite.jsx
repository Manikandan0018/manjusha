import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const FavoritesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ User state
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/me`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  // ✅ Fetch favourites
  const { data: favourites = [], isLoading } = useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      const res = await axios.get(
        `${VITE_BACKEND_URL}api/favourites/myfavourites`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  // ✅ Fetch cart items (to check duplicates)
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems"],
    queryFn: async () => {
      const res = await axios.get(`${VITE_BACKEND_URL}api/MyCartProduct/mycart`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  // ✅ Remove favourite mutation
  const removeFavouriteMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(
        `${VITE_BACKEND_URL}api/favourites/remove/${productId}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favourites"]);
    },
  });

  // ✅ Add to cart mutation
  const addCartProduct = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/MyCartProduct/addMyCart`,
        payload,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartItems"]);
      navigate("/cart");
    },
  });

  // ✅ Handle Add to Cart
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
      shippingAddress: user.shippingAddress, // ✅ Add shipping address
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
      },
      onError: () => {
        toast.error("Failed to add product");
      },
    });
  };

  if (isLoading) return <p className="text-center">Loading favourites...</p>;

  return (
    <section className="bg-white py-10 px-6">
      <h2 className="text-2xl font-bold mb-6">❤️ Your Favourite Products</h2>
      {favourites.length === 0 ? (
        <p className="text-gray-500">No favourite products yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((fav, index) => (
            <div
              key={index}
              className="bg-white border border-rose-100 rounded-lg shadow hover:shadow-md p-4 flex flex-col"
            >
              {/* Product Image */}
              <img
                src={fav.product.image}
                alt={fav.product.name}
                className="w-full h-64 object-contain rounded-t-lg bg-white"
              />

              {/* Product Info */}
              <div className="p-2 flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {fav.product.name}
                </h3>
                <p className="text-rose-600 font-extrabold text-xl">
                  ₹{fav.product.price}
                </p>
                <p className="text-gray-500 text-sm">
                  {fav.product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => removeFavouriteMutation.mutate(fav.product._id)}
                  className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
                >
                  Remove ❌
                </button>
                <button
                  onClick={() => handleAddToCart(fav.product)} // ✅ fixed here
                  disabled={addCartProduct.isLoading}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  {addCartProduct.isLoading ? "Adding..." : "Add to Cart 🛒"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
            <ToastContainer />

    </section>
  );
};
