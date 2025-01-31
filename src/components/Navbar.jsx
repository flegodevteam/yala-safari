import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import yala from "../assets/Head.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="text-black font-bold sticky top-0 z-50 px-4 from-blue-400 to-black bg-gradient-to-r py-2"
      // style={backgroundImageStyle}
    >
      <div className="flex justify-between items-center">
        <div className="hidden md:flex flex-col">
          <h1 className="text-3xl">YALA NATIONAL PARK</h1>
          <p>The Official Travellers Portal</p>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        <nav
          className={`md:flex ${isOpen ? "block" : "hidden"} w-full md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row gap-5 items-center text-white">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/destinations"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Destinations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/safari-packages"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Safari Packages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog-and-trips"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Blog And Trips
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customer-reviews"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Customer Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  isActive
                    ? "bg-yellow-500 text-black p-2 rounded"
                    : "hover:text-yellow-500 hover:border p-2 hover:bg-blue-200 rounded"
                }
              >
                Gallery
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="hidden md:flex gap-4 ">
          <button className="px-3 py-3 font-medium text-blue-700 bg-white rounded hover:bg-gray-100">
            Book Now
          </button>
          <button className="px-3 py-3 font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600">
            Explore Tours
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
