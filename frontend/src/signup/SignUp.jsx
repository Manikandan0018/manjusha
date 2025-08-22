import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios";
import logo from "../eLogo.png";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side check
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", form);
      console.log(res.data);
      navigate("/login"); // Redirect to login after success
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div>
        <img src={logo} alt="Efyer Logo" className="w-32 md:w-40" />
      </div>

      {/* Signup Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">
          Create your account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please enter details to sign up
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition mb-3"
        >
          Sign Up
        </button>

        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <FaFacebookF />
          Sign up with Facebook
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-orange-500 font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}
