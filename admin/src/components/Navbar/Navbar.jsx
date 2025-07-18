import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logo click
  const handleLogoClick = () => {
    setIsLoading(true);
    // Simulate navigation or reload
    setTimeout(() => {
      setIsLoading(false);
      // Add your navigation logic here
      console.log("Logo clicked - navigate to home");
    }, 500);
  };

  // Handle profile click
  const handleProfileClick = () => {
    // Add your profile menu logic here
    console.log("Profile clicked - open profile menu");
  };

  return (
    <div
      className={`navbar navbar-fade-in ${isScrolled ? "scrolled" : ""} ${
        isLoading ? "loading" : ""
      }`}
    >
      <img
        src={assets.logo}
        alt="Company Logo"
        className="logo"
        onClick={handleLogoClick}
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' fill='%23ea580c'%3E%3Ctext x='10' y='25' font-family='Arial, sans-serif' font-size='20' font-weight='bold'%3ELogo%3C/text%3E%3C/svg%3E";
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
  );
};

export default Navbar;
