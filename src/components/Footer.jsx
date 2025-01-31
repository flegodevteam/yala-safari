import React from "react";
import Logo from "../assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="from-blue-400 to-black bg-gradient-to-r text-white py-8 px-4 md:px-12 lg:px-24">
      {" "}
      {/* Dark background, padding */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        {" "}
        {/* Flexbox for layout */}
        {/* Left Section (Logo and Description) */}
        <div className="mb-6 md:mb-0">
          {" "}
          {/* Margin bottom for stacking on smaller screens */}
          <div className="flex items-center mb-4">
            {" "}
            {/* Logo and text side by side */}
            <img
              src={Logo}
              alt="Personal Tour Drivers"
              className="h-12 w-auto mr-2"
            />{" "}
            {/* Adjust height as needed, add margin right */}
            <span className="text-lg font-bold">
              Personal Tour Drivers <br /> In Sri Lanka
            </span>{" "}
            {/* Smaller font size, line break */}
          </div>
          <p className="text-sm text-gray-400">
            Personal Tour Drivers in Sri Lanka has best tourism guiders and
            carefully drivers for enjoy your tour in whole island.
          </p>
        </div>
        {/* Middle Left Section (Interest Tours) */}
        <div className="mb-6 md:mb-0">
          <h4 className="font-bold mb-4">Interest Tours</h4>
          <ul className="text-sm">
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Sigiriya
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Kandy
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Nuwara Eliya
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Galle
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Colombo
              </a>
            </li>
          </ul>
        </div>
        {/* Middle Right Section (Quick Links) */}
        <div className="mb-6 md:mb-0">
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="text-sm">
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Itineraries
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Day Tours
              </a>
            </li>
          </ul>
        </div>
        {/* Right Section (City Tours) */}
        <div>
          <h4 className="font-bold mb-4">City Tours</h4>
          <ul className="text-sm">
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Sigiriya
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Kandy
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Nuwara Eliya
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-300">
                Galle
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">
                Colombo
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom Bar (Copyright) */}
      <div className="text-center text-sm text-gray-400 mt-8 pt-4 border-t border-gray-600">
        {" "}
        {/* Added top border and padding */}
        <p>
          &copy; {new Date().getFullYear()} Wildlife Sanctuary | All Rights
          Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
