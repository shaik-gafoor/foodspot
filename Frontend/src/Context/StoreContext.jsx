import React, { createContext, useEffect } from "react";
import { food_list } from "../assets/assets";
import { useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    console.log("Adding to cart:", itemId);

    setCartItems((prev) => {
      const currentCart = prev || {};

      if (!currentCart[itemId]) {
        return { ...currentCart, [itemId]: 1 };
      } else {
        return { ...currentCart, [itemId]: currentCart[itemId] + 1 };
      }
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    console.log("Removing from cart:", itemId);

    setCartItems((prev) => {
      const currentCart = prev || {};

      if (!currentCart[itemId] || currentCart[itemId] <= 1) {
        const { [itemId]: removed, ...rest } = currentCart;
        return rest;
      } else {
        return { ...currentCart, [itemId]: currentCart[itemId] - 1 };
      }
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    const currentCart = cartItems || {};

    for (const item in currentCart) {
      if (currentCart[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * currentCart[item];
        }
      }
    }
    return totalAmount;
  };

  // NEW: Place Order Function
  const placeOrder = async (orderData) => {
    const userToken = token || localStorage.getItem("token");

    console.log("Placing order with token:", userToken);
    console.log("Order data:", orderData);

    if (!userToken) {
      console.error("No token found for authentication");
      return {
        success: false,
        message: "Please login to place order",
      };
    }

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {
          token: userToken,
          "Content-Type": "application/json",
        },
      });

      console.log("Order placed successfully:", response.data);

      // Clear cart after successful order
      if (response.data.success) {
        setCartItems({});
      }

      return response.data;
    } catch (error) {
      console.error("Order placement failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to place order",
      };
    }
  };

  // NEW: Get Order History
  const getUserOrders = async () => {
    const userToken = token || localStorage.getItem("token");

    if (!userToken) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token: userToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { success: false, message: "Failed to fetch orders" };
    }
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems({});
    }
  };

  // NEW: Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  // Debug cart changes
  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  // Debug token changes
  useEffect(() => {
    console.log("Token updated:", token);
  }, [token]);

  const contextValue = {
    food_list,
    cartItems: cartItems || {},
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    placeOrder, // NEW: Added placeOrder function
    getUserOrders, // NEW: Added getUserOrders function
    logout, // NEW: Added logout function
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
