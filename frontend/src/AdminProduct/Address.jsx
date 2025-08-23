import { useState, useEffect } from "react";
import axios from "axios";
import { PaymentOption } from "../PaymentOption";
import { FaUserEdit, FaPrint, FaSave, FaTimes } from "react-icons/fa";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const Address = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);

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
      const userData = res.data.user; // 👈 Extract user object
      setUser(userData);
      setFormData({
        name: userData.fullName,
        email: userData.email,
        shippingAddress: userData.shippingAddress || {
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

  if (!user) return <div className="p-8 text-center text-lg">Loading...</div>;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-500">Efyer</h1>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6 w-full justify-end">
          <div className="flex gap-2">
            <select className="border px-3 py-1 rounded text-sm bg-gray-100">
              <option>All Category</option>
            </select>
            <input
              type="text"
              placeholder="Search products"
              className="border px-4 py-1 rounded w-60"
            />
            <button className="bg-orange-500 text-white px-4 py-1 rounded">
              🔍
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <select className="border px-2 py-1 rounded text-sm">
              <option>English</option>
            </select>
            <div className="cursor-pointer hover:text-orange-500">🛒 Cart</div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow px-4 py-2 mt-16">
          <div className="flex gap-2 mb-2">
            <select className="border px-2 py-1 rounded bg-gray-100">
              <option>All Category</option>
            </select>
            <input
              type="text"
              placeholder="Search"
              className="border px-4 py-1 rounded w-full"
            />
            <button className="bg-orange-500 text-white px-3 py-1 rounded">
              🔍
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="pt-28 px-4 pb-16 bg-gray-100 min-h-screen flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Profile Card */}
        <section className="w-full lg:w-2/3 bg-white p-8 rounded-2xl shadow-lg transition-all">
          <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
            Delivery Address
          </h2>

          {!editMode ? (
            <div className="space-y-4 text-gray-800 text-lg">
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
                <p>{user.shippingAddress?.address}</p>
                <p>
                  {user.shippingAddress?.city}, {user.shippingAddress?.state}
                </p>
                <p>
                  {user.shippingAddress?.zip}, {user.shippingAddress?.country}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
                >
                  <FaUserEdit /> Edit Profile
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded shadow-sm focus:outline-orange-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.shippingAddress.address}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.shippingAddress.zip}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <FaSave /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Payment Option */}
        <section className="w-full lg:w-1/3">
          <PaymentOption />
        </section>
      </main>
    </>
  );
};
