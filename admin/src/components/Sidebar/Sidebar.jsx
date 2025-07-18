import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Listen for navbar mobile toggle
  useEffect(() => {
    const handleNavbarMobileToggle = (event) => {
      setIsMobileOpen(event.detail.isOpen);
    };

    window.addEventListener("navbarMobileToggle", handleNavbarMobileToggle);
    return () =>
      window.removeEventListener(
        "navbarMobileToggle",
        handleNavbarMobileToggle
      );
  }, []);

  // Toggle sidebar collapse on desktop ONLY
  const toggleCollapse = () => {
    if (!isMobile) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("sidebarToggle", {
          detail: { collapsed: newCollapsed },
        })
      );
    }
  };

  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    setIsMobileOpen(false);

    // Notify navbar
    window.dispatchEvent(
      new CustomEvent("mobileMenuToggle", {
        detail: { isOpen: false },
      })
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobile ? (isMobileOpen ? "mobile-visible" : "mobile-hidden") : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <span className="title-icon">🍽️</span>
            Food Admin
          </h2>
          {!isMobile && (
            <button
              className="sidebar-toggle"
              onClick={toggleCollapse}
              aria-label="Toggle sidebar"
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-options">
            <NavLink
              to="/add"
              className="sidebar-option"
              onClick={isMobile ? closeMobileMenu : undefined}
              data-tooltip="Add Items"
            >
              <img
                src={assets.add_icon}
                alt="Add Icon"
                className="sidebar-option-icon"
              />
              <span className="sidebar-option-text">Add Items</span>
            </NavLink>

            <NavLink
              to="/list"
              className="sidebar-option"
              onClick={isMobile ? closeMobileMenu : undefined}
              data-tooltip="List Items"
            >
              <img
                src={assets.order_icon}
                alt="List Icon"
                className="sidebar-option-icon"
              />
              <span className="sidebar-option-text">List Items</span>
            </NavLink>

            <NavLink
              to="/orders"
              className="sidebar-option"
              onClick={isMobile ? closeMobileMenu : undefined}
              data-tooltip="Orders"
            >
              <img
                src={assets.order_icon}
                alt="Orders Icon"
                className="sidebar-option-icon"
              />
              <span className="sidebar-option-text">Orders</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">A</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">Admin</p>
              <p className="sidebar-user-role">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
