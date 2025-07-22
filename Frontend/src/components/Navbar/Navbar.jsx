import { assets } from "../../assets/assets";
import "./Navbar.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

function Navbar({ setShowLogin }) {
  const [line, setLine] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const toggleMenu = () => {
    const menu = menuRef.current;
    if (!menu) return;
    if (isMenuOpen) {
      menu.style.maxHeight = "0px";
      setIsMenuOpen(false);
    } else {
      menu.style.maxHeight = "500px";
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

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
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

  // ✅ FIXED: Updated handleOrdersClick to navigate to /myorders
  const handleOrdersClick = () => {
    setProfileOpen(false);
    navigate("/myorders");
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

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
            className={`menu-item ${line === "menu" ? "active" : ""}`}
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
          {!token && (
            <button onClick={() => setShowLogin(true)} className="sign-in-btn">
              Sign In
            </button>
          )}
        </li>
      </ul>

      <div className="navbar-right">
        <Link to="/" className="nav-icon">
          <img src={assets.search_icon} alt="search" />
        </Link>

        <div className="navbar-search-icon">
          <Link to="/cart" className="nav-icon">
            <img src={assets.basket_icon} alt="basket" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {token && (
          <div className="navbar-profile-right" ref={profileRef}>
            <div
              className="profile-trigger-right"
              onClick={toggleProfileDropdown}
            >
              {assets.profile_icon ? (
                <img
                  src={assets.profile_icon}
                  alt="Profile"
                  className="profile-img-right"
                />
              ) : (
                <div className="profile-icon-fallback-right">
                  <User size={22} />
                </div>
              )}
            </div>
            <div
              className={`nav-profile-dropdown-right ${
                profileOpen ? "show" : ""
              }`}
            >
              {/* ✅ FIXED: Removed duplicate onClick handlers */}
              <div className="dropdown-item-right" onClick={handleOrdersClick}>
                {assets.bag_icon ? (
                  <img src={assets.bag_icon} alt="Orders" />
                ) : (
                  <ShoppingBag size={18} />
                )}
                <span>Orders</span>
              </div>
              <div className="dropdown-divider-right"></div>
              <div
                className="dropdown-item-right"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
              >
                {assets.logout_icon ? (
                  <img src={assets.logout_icon} alt="Logout" />
                ) : (
                  <LogOut size={18} />
                )}
                <span>Logout</span>
              </div>
            </div>
          </div>
        )}

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
