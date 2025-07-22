import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import "./MyOrder.css";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#4CAF50";
      case "out for delivery":
        return "#FF9800";
      case "preparing":
        return "#2196F3";
      default:
        return "#FF7043";
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <p className="orders-subtitle">Track and manage your food orders</p>
      </div>

      {data.length === 0 ? (
        <div className="no-orders">
          <img src={assets.parcel_icon} alt="No orders" />
          <h3>No Orders Yet</h3>
          <p>When you place orders, they will appear here</p>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div className="order-icon">
                  <img src={assets.parcel_icon} alt="Order" />
                </div>
                <div className="order-info">
                  <div className="order-id">
                    Order #{order._id?.slice(-6) || index + 1}
                  </div>
                  <div className="order-date">
                    {order.createdAt ? formatDate(order.createdAt) : "Recent"}
                  </div>
                </div>
                <div className="order-status">
                  <span
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  ></span>
                  <span className="status-text">
                    {order.status || "Processing"}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items Ordered:</h4>
                <p className="items-list">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return `${item.name} × ${item.quantity}`;
                    } else {
                      return `${item.name} × ${item.quantity}, `;
                    }
                  })}
                </p>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value amount">₹{order.amount}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Items Count:</span>
                  <span className="detail-value">
                    {order.items.length} items
                  </span>
                </div>
              </div>

              <div className="order-actions">
                <button className="track-btn">
                  <span>📍</span>
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
