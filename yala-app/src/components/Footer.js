import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTripadvisor,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="relative bg-[#333333] text-white overflow-hidden" role="contentinfo">
      {/* Angled Top Cut */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 bg-[#333333]"
        style={{
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Top Section - Brand & Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-white/20">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-transparent rounded flex items-center justify-center">
                <img src={logo} alt="Yala Safari" className="w-10 h-10" />  
              </div>
              <span className="text-2xl font-bold text-white">Yala Safari</span>
            </div>
            <span className="text-white/60 text-sm">/</span>
            <span className="text-white/60 text-sm">Simply #1 Safari Experience</span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/share/1EDyLRKpvB" target="_blank" rel="noreferrer" className="text-[#ffffff] hover:text-[#f26b21] transition-colors duration-300" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="/"  className="text-[#ffffff] hover:text-[#f26b21] transition-colors duration-300" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="/" className="text-[#ffffff] hover:text-[#f26b21] transition-colors duration-300" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="https://www.tripadvisor.com/Attraction_Review-g1102395-d9975853-Reviews-Yala_Safari_With_Tharindu_Gihan-Tissamaharama_Southern_Province.html" target="_blank" rel="noreferrer" className="text-[#ffffff] hover:text-[#f26b21] transition-colors duration-300" aria-label="TripAdvisor">
                <FaTripadvisor size={24} />
              </a>         
          </div>
        </div>

        {/* Main Content - Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Column 1: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Quick Links
            </h3>
            <div className="space-y-4 flex flex-col">
              <Link
                to="/"
                className="text-base text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <span className="text-[#f26b21]">▸</span>
                <span>Home</span>
              </Link>
              <Link
                to="/packages"
                className="text-base text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <span className="text-[#f26b21]">▸</span>
                <span>List Layout</span>
              </Link>
              <Link
                to="/blog"
                className="text-base text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <span className="text-[#f26b21]">▸</span>
                <span>Blog</span>
              </Link>
              <Link
                to="/contact"
                className="text-base text-white/90 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                <span className="text-[#f26b21]">▸</span>
                <span>Contact</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Contact Us */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Contact Us
            </h3>
            <div className="space-y-4 flex flex-col">
              <div className="flex items-start gap-3 text-base text-white/90">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>191/6, Mahasenpura, Tissamaharama, <br/> Yala, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3 text-base text-white/90">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+94 773 742 700</span>
              </div>
              <div className="flex items-center gap-3 text-base text-white/90">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@yalasafari.com</span>
              </div>
            </div>
          </div>

          {/* Column 3: Remain Updated (Newsletter) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">
              Remain Updated
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#f26b21] hover:bg-[#e05a1a] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} Yala Safari. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-white/70 hover:text-white transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-white/70 hover:text-white transition-colors duration-300"
              >
                Privacy
              </Link>
            </div>
          </div>
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              Developed by <a href="https://www.flegoinnovation.com" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white transition-colors duration-300">Flego Innovations</a>
            </p>
   
          </div>
        </div>
      </div>
    </footer>
  );
}
