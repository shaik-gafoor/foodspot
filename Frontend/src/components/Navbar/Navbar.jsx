import { assets } from "../../assets/assets";
import "./Navbar.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AppDownload from "../AppDownload/AppDownload";
import Cart from "../../pages/Cart/Cart";
import { StoreContext } from "../../Context/StoreContext";

function Navbar({ setShowLogin }) {
  const [line, setLine] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    const menu = menuRef.current;
    if (!menu) return;

    if (isMenuOpen) {
      menu.style.maxHeight = "0px";
      setIsMenuOpen(false);
    } else {
      menu.style.maxHeight = "300px";
      setIsMenuOpen(true);
    }
  };

  const handleMenuItemClick = (itemName) => {
    setLine(itemName);
    if (window.innerWidth <= 768) {
      const menu = menuRef.current;
      if (menu) {
        menu.style.maxHeight = "0px";
        setIsMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".menu-icon")
      ) {
        if (isMenuOpen) {
          menuRef.current.style.maxHeight = "0px";
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        const menu = menuRef.current;
        if (menu) {
          menu.style.maxHeight = "";
          setIsMenuOpen(false);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const { getTotalCartAmount } = useContext(StoreContext);

  return (
    <div className="navbar">
      <img src={assets.logo} alt="logo" className="logo" />

      <ul className="navbar-menu" ref={menuRef}>
        <li>
          <Link
            to="/"
            onClick={() => handleMenuItemClick("home")}
            className={`menu-item ${line === "home" ? "active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href="#explore-menu"
            onClick={() => handleMenuItemClick("menu")}
            className={`menuaitem ${line === "menu" ? "active" : ""}`}
          >
            Menu
          </a>
        </li>
        <li>
          <a
            href="#app-download"
            onClick={() => handleMenuItemClick("mobile-app")}
            className={`menu-item ${line === "mobile-app" ? "active" : ""}`}
          >
            Mobile-App
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => handleMenuItemClick("contact-us")}
            className={`menu-item ${line === "contact-us" ? "active" : ""}`}
          >
            Contact-us
          </a>
        </li>
        <li>
          <button onClick={() => setShowLogin(true)}>Sign Up</button>
        </li>
      </ul>

      <div className="navbar-right">
        <Link to="/">
          <img src={assets.search_icon} alt="search" />
        </Link>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="basket" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {isMenuOpen ? (
          <X className="menu-icon" onClick={toggleMenu} />
        ) : (
          <Menu className="menu-icon" onClick={toggleMenu} />
        )}
      </div>
    </div>
  );
}

export default Navbar;
