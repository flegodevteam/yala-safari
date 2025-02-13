import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoCall, IoMail } from "react-icons/io5";

export default function Navbar() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-transparent text-black">
      <div className="flex justify-between items-center px-6 py-2 text-sm">
        <div className="flex items-center space-x-4">
          <IoCall />
          <span>+12 345 678 969</span>
          <IoMail />
          <span>YalaSafari123@gmail.com</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaFacebookF className="cursor-pointer" />
          <FaTwitter className="cursor-pointer" />
          <a
            href="https://www.linkedin.com/in/khan0610"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn className="cursor-pointer" />
          </a>
        </div>
      </div>
      <nav className="bg-blue-800 px-6 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold flex items-center">
          <span className="text-orange-500 text-3xl">⛯</span>
          <span className="ml-2">Yala Safari</span>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <ul
          className={`flex space-x-6 md:flex ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/destinations"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Destinations
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/safari-packages"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Safari Packages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog-and-trips"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Blogs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Gallery
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customer-reviews"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-white"
              }
            >
              Reviews
            </NavLink>
          </li>
        </ul>
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => navigate("/online-booking")}
            className="bg-orange-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-orange-600 transition"
          >
            Book Now
          </button>
          <button
            onClick={() => navigate("/Dashboard")}
            className="bg-orange-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-orange-600 transition"
          >
            Dashboard
          </button>
        </div>
      </nav>
    </header>
  );
}
