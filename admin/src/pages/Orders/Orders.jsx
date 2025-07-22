import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  // Detect sidebar state changes
  useEffect(() => {
    const detectSidebarState = () => {
      // Check for collapsed sidebar class or width
      const sidebar = document.querySelector('.sidebar, [class*="sidebar"]');
      if (sidebar) {
        const isCollapsed =
          sidebar.classList.contains("collapsed") ||
          sidebar.classList.contains("minimized") ||
          sidebar.offsetWidth < 150;
        setSidebarCollapsed(isCollapsed);
      }
    };

    // Initial detection
    detectSidebarState();

    // Create mutation observer to watch for sidebar changes
    const observer = new MutationObserver(() => {
      setTimeout(detectSidebarState, 50); // Small delay to ensure DOM updates
    });

    // Observe changes to the body and sidebar
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // Listen for window resize
    window.addEventListener("resize", detectSidebarState);

    // Listen for custom sidebar toggle events (if your app dispatches them)
    const handleSidebarToggle = () => {
      setTimeout(detectSidebarState, 100);
    };

    document.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", detectSidebarState);
      document.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className={`order add ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ",  ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
