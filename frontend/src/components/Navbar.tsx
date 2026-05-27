import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { name: "WHAT'S NEW", path: "/" },
    { name: "WHAT TO DO", path: "/destinations" },
    { name: "WHERE TO GO", path: "/destinations" },
    { name: "PLAN YOUR TRIP", path: "/plan" },
    { name: "UPCOMING EVENTS", path: "/events" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Desktop Navigation - Centered Menu */}
          <div className="hidden md:flex items-center justify-center w-full space-x-5 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setActiveLink(link.path)}
                className={`relative font-light tracking-wide transition-all duration-300 text-[11px] lg:text-xs uppercase ${
                  isScrolled
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-white/80 hover:text-yellow-300"
                } ${
                  activeLink === link.path
                    ? isScrolled
                      ? "text-blue-600"
                      : "text-yellow-300"
                    : ""
                }`}
              >
                {link.name}
                {/* Active Indicator */}
                {activeLink === link.path && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - Language & Auth */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              className={`font-light text-[11px] lg:text-xs tracking-wide uppercase transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-blue-600"
                  : "text-white/80 hover:text-yellow-300"
              }`}
            >
              ENGLISH
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <span
                  className={`text-[11px] lg:text-xs font-light ${
                    isScrolled ? "text-gray-500" : "text-white/80"
                  }`}
                >
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] lg:text-xs font-light hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-1 rounded-full text-[11px] lg:text-xs font-light uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isScrolled
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Smaller Font */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden py-3 border-t ${
              isScrolled ? "border-gray-200" : "border-white/20"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-2 transition-colors font-light tracking-wide text-[11px] uppercase ${
                  isScrolled
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-white/80 hover:text-yellow-300"
                }`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveLink(link.path);
                }}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-white/20">
              <button
                className={`block w-full text-left py-2 font-light tracking-wide text-[11px] uppercase ${
                  isScrolled
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-white/80 hover:text-yellow-300"
                }`}
              >
                ENGLISH
              </button>
              {!user && (
                <Link
                  to="/login"
                  className="block mt-2 bg-white/20 backdrop-blur-md text-white text-center px-4 py-1.5 rounded-lg border border-white/30 font-light text-[11px] uppercase tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full mt-2 bg-red-500/80 text-white text-center px-4 py-1.5 rounded-lg font-light text-[11px] uppercase tracking-wide"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
