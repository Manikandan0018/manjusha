import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-black text-rose-700 py-10 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-rose-500 mb-3">FurniHub</h2>
          <p className="text-sm text-rose-400">
            Discover modern furniture with style and comfort. Shop with confidence and elegance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-rose-500 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-rose-400">
            <li><a href="#" className="hover:text-rose-600 transition">About Us</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">Contact</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-rose-500 mb-3">Categories</h3>
          <ul className="space-y-2 text-sm text-rose-400">
            <li><a href="#" className="hover:text-rose-600 transition">Living Room</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">Bedroom</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">Dining</a></li>
            <li><a href="#" className="hover:text-rose-600 transition">Office</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-rose-500 mb-3">Newsletter</h3>
          <p className="text-sm text-rose-400 mb-3">Subscribe for latest updates</p>
          <form className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded bg-rose-50 text-rose-700 text-sm placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <hr className="my-8 border-rose-200" />

      {/* Bottom copyright */}
      <div className="text-center text-sm text-rose-400">
        &copy; {new Date().getFullYear()} FurniHub. All rights reserved.
      </div>
    </footer>
  )
}
