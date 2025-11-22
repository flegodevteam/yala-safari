import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Check if current path matches link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-[#034123]/10" 
          : "bg-white/80 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center group transition-transform duration-300 hover:scale-105" 
              onClick={handleLinkClick}
            >
              <img 
                className="h-8 w-auto lg:h-10 transition-all duration-300" 
                src={logo} 
                alt="Yala Safari" 
              />
              <span className="ml-2 text-xl lg:text-2xl font-bold text-[#034123] group-hover:text-[#026042] transition-colors duration-300">
                Yala Safari
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              Home
            </Link>
            <Link
              to="/packages"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/packages") || location.pathname.startsWith("/packages")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              Packages
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/about")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/blog")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/rooms"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/rooms") || location.pathname.startsWith("/room") || location.pathname.startsWith("/taxi")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              Rooms & Taxi
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive("/contact")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              Contact
            </Link>
            {/* Track Booking Link */}
            <Link
              to="/booking-status"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                isActive("/booking-status")
                  ? "text-[#034123] bg-[#034123]/10 backdrop-blur-sm"
                  : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track Booking
            </Link>
          </nav>

          {/* CTA and Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/packages"
              className="hidden md:inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-[#f26b21] hover:bg-[#e05a1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f26b21]/50 transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
            >
              Book Now
            </Link>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-[#034123] hover:text-[#026042] hover:bg-[#034123]/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#034123]/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
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
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    strokeWidth="2.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="pt-3 pb-4 space-y-1 bg-white/95 backdrop-blur-xl border-t border-[#034123]/10 shadow-lg mx-4 mb-2 rounded-b-2xl">
          <Link
            to="/"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/packages"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/packages") || location.pathname.startsWith("/packages")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            Packages
          </Link>
          <Link
            to="/about"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/about")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            About Us
          </Link>
          <Link
            to="/blog"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/blog")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            Blog
          </Link>
          <Link
            to="/rooms"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/rooms") || location.pathname.startsWith("/room") || location.pathname.startsWith("/taxi")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            Rooms & Taxi
          </Link>
          <Link
            to="/contact"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/contact")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            Contact
          </Link>
          {/* Track Booking Link (Mobile) */}
          <Link
            to="/booking-status"
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isActive("/booking-status")
                ? "text-[#034123] bg-[#034123]/10"
                : "text-[#333333] hover:text-[#034123] hover:bg-[#034123]/5"
            }`}
            onClick={handleLinkClick}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track Booking
            </span>
          </Link>
          <div className="pt-2 border-t border-[#034123]/10 mt-2">
            <Link
              to="/packages"
              className="block mx-4 px-4 py-3 text-base font-semibold text-center rounded-xl text-white bg-[#f26b21] hover:bg-[#e05a1a] transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleLinkClick}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}