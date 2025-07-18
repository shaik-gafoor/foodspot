import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check screen size for mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close mobile menu when switching to desktop
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Listen for mobile menu state from sidebar
  useEffect(() => {
    const handleMobileMenuToggle = (event) => {
      setIsMobileMenuOpen(event.detail.isOpen);
    };

    window.addEventListener("mobileMenuToggle", handleMobileMenuToggle);
    return () =>
      window.removeEventListener("mobileMenuToggle", handleMobileMenuToggle);
  }, []);

  // Handle logo click
  const handleLogoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 300);
  };

  // Handle profile click
  const handleProfileClick = () => {
    console.log("Profile clicked - open profile menu");
    // Add profile dropdown logic here
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Dispatch event to notify sidebar
    window.dispatchEvent(
      new CustomEvent("navbarMobileToggle", {
        detail: { isOpen: newState },
      })
    );
  };

  // Mobile menu items
  const menuItems = [
    { path: "/add", label: "Add Items", icon: "➕" },
    { path: "/list", label: "List Items", icon: "📝" },
    { path: "/orders", label: "Orders", icon: "📦" },
  ];

  // Handle mobile navigation
  const handleMobileNavigation = (path) => {
    navigate(path);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("navbarMobileToggle", {
        detail: { isOpen: false },
      })
    );
  };

  return (
    <>
      <div
        className={`navbar navbar-fade-in ${isScrolled ? "scrolled" : ""} ${
          isLoading ? "loading" : ""
        } ${isMobile ? "mobile" : ""}`}
      >
        {/* Mobile Menu Button - Only visible on mobile */}
        {isMobile && (
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}

        <img
          src={assets.logo}
          alt="Company Logo"
          className="logo"
          onClick={handleLogoClick}
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' fill='%23ea580c'%3E%3Ctext x='10' y='25' font-family='Arial, sans-serif' font-size='20' font-weight='bold'%3EFood Admin%3C/text%3E%3C/svg%3E";
          }}
          tabIndex={0}
          role="button"
          aria-label="Go to homepage"
        />

        <div className="profile-wrapper">
          <img
            src={assets.profile_image}
            alt="User Profile"
            className="profile"
            onClick={handleProfileClick}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23e5e7eb'%3E%3Ccircle cx='50' cy='35' r='20' fill='%23374151'/%3E%3Cpath d='M50 60c-15 0-30 10-30 20v10h60v-10c0-10-15-20-30-20z' fill='%23374151'/%3E%3C/svg%3E";
            }}
            tabIndex={0}
            role="button"
            aria-label="Open profile menu"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={handleMobileMenuToggle}
        ></div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobile && (
        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <h3>Navigation</h3>
          </div>
          <div className="mobile-menu-items">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className={`mobile-menu-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleMobileNavigation(item.path)}
              >
                <span className="mobile-menu-icon">{item.icon}</span>
                <span className="mobile-menu-text">{item.label}</span>
                <span className="mobile-menu-arrow">→</span>
              </div>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">A</div>
              <div className="mobile-user-details">
                <p>Admin User</p>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
