import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={logo} alt="Yala Safari" />
              <span className="ml-2 text-xl font-bold text-green-700">
                Yala Safari
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/packages"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Packages
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* CTA and Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/booking"
              className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Book Now
            </Link>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/packages"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          >
            Packages
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          >
            About Us
          </Link>
          <Link
            to="/blog"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
          >
            Contact
          </Link>
          <Link
            to="/booking"
            className="block px-3 py-2 text-base font-medium text-green-600 hover:bg-green-50"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
