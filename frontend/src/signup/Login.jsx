import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaFacebookF } from 'react-icons/fa';
import axios from 'axios';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/login`,
        form,
        { withCredentials: true } // Important for httpOnly cookie
      );

      if (res.status === 200) {
        navigate('/');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">
          Log into your account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please enter your credentials to log in
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <FaEye />
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-6">
          <button
            type="button"
            className="text-sm text-orange-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition mb-3"
        >
          Log In
        </button>

        {/* Facebook login (optional) */}
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <FaFacebookF />
          Sign in with Facebook
        </button>

        {/* Sign Up link */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            type="button"
            className="text-orange-500 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
