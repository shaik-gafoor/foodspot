import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData || !userData._id) {
      console.log("User not found in localStorage");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/user/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  if (!orders.length) {
    return <p>No orders found</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>{order.productName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
