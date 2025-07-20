import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const endpoint =
      currState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        // ✅ Save token
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // ✅ Save user object to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ✅ Close popup and show alert
        setShowLogin(false);
        alert(
          currState === "Login"
            ? "Login successful!"
            : "Account created successfully!"
        );
      } else {
        alert(response.data.message || "Login/Register failed");
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Register" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">
          {currState === "Login" ? "Login" : "Create Account"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        <div className="login-popup-login">
          {currState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Register")}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
