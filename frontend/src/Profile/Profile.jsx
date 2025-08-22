import { useEffect, useState } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setFormData({
          name: res.data.fullName,
          email: res.data.email,
          shippingAddress: res.data.shippingAddress || {
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
          },
        });
      })
      .catch((err) => console.error("Fetch failed", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "state", "zip", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${VITE_BACKEND_URL}api/profile/update`,
        {
          fullName: formData.name,
          email: formData.email,
          shippingAddress: formData.shippingAddress,
        },
        { withCredentials: true }
      );
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 shadow-xl rounded-2xl bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-rose-500">
        My Profile
      </h2>

      {!editMode ? (
        <div className="space-y-6">
          <p>
            <span className="font-semibold text-rose-500">Name:</span>{" "}
            {user.fullName}
          </p>
          <p>
            <span className="font-semibold text-rose-500">Email:</span>{" "}
            {user.email}
          </p>
          <div className="border-t border-rose-200 pt-4">
            <h3 className="text-xl font-semibold mb-3 text-rose-500">
              Shipping Address
            </h3>
            <p>{user.shippingAddress?.address}</p>
            <p>
              {user.shippingAddress?.city}, {user.shippingAddress?.state}
            </p>
            <p>
              {user.shippingAddress?.zip}, {user.shippingAddress?.country}
            </p>
          </div>
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => setEditMode(true)}
              className="bg-rose-500 text-white px-5 py-2 rounded-full font-medium hover:bg-rose-600 transition duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={() => window.print()}
              className="bg-rose-100 text-rose-600 px-5 py-2 rounded-full font-medium hover:bg-rose-200 transition duration-300"
            >
              Print Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-rose-500">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-rose-500">Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              className="w-full border border-rose-200 px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-rose-500">Address</label>
            <input
              type="text"
              name="address"
              value={formData.shippingAddress.address}
              onChange={handleChange}
              className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-rose-500">City</label>
              <input
                type="text"
                name="city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-rose-500">State</label>
              <input
                type="text"
                name="state"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-rose-500">ZIP</label>
              <input
                type="text"
                name="zip"
                value={formData.shippingAddress.zip}
                onChange={handleChange}
                className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-rose-500">Country</label>
              <input
                type="text"
                name="country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                className="w-full border border-rose-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 transition duration-300"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4 flex-wrap gap-4">
            <button
              type="submit"
              className="bg-rose-500 text-white px-6 py-2 rounded-full font-medium hover:bg-rose-600 transition duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
