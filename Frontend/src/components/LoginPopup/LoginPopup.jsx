import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false); // Add loading state
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Reset form when switching between Login/Sign Up
  const switchState = (newState) => {
    setCurrState(newState);
    if (newState === "Login") {
      setData({ name: "", email: data.email, password: "" }); // Keep email
    } else {
      setData({ name: "", email: data.email, password: "" }); // Keep email
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let newUrl = url;

      // Build correct API endpoints
      if (currState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      console.log("API URL:", newUrl);
      console.log("Data being sent:", data);

      // Prepare data based on current state
      const submitData =
        currState === "Login"
          ? { email: data.email, password: data.password }
          : { name: data.name, email: data.email, password: data.password };

      const response = await axios.post(newUrl, submitData);

      console.log("API Response:", response.data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);

        // Success message
        alert(
          currState === "Login"
            ? "Login successful!"
            : "Account created successfully!"
        );
      } else {
        alert(
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Authentication error:", error);

      // Better error handling
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else if (error.response && error.response.status === 400) {
        alert("Invalid credentials or user already exists.");
      } else if (error.response && error.response.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay" onClick={() => setShowLogin(false)}>
      <form
        onSubmit={onLogin}
        className="login-popup-container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          {assets.cross_icon ? (
            <img
              onClick={() => setShowLogin(false)}
              src={assets.cross_icon}
              alt="Close"
              className="close-icon"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="close-btn"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your full name"
              required
              minLength={2}
              disabled={loading}
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
            disabled={loading}
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
            minLength={6}
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading
            ? currState === "Sign Up"
              ? "Creating Account..."
              : "Signing In..."
            : currState === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required id="terms" disabled={loading} />
          <label htmlFor="terms">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>

        <div className="login-popup-switch">
          {currState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => !loading && switchState("Sign Up")}>
                Click here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => !loading && switchState("Login")}>
                Login here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
