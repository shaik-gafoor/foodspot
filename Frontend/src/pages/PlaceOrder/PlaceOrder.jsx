import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");

    console.log("SUBMIT CLICKED - Starting order process");
    console.log("food_list:", food_list);
    console.log("cartItems:", cartItems);

    const orderItems = food_list
      .filter((item) => {
        const quantity = cartItems[item._id];
        return quantity && typeof quantity === "number" && quantity > 0;
      })
      .map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: cartItems[item._id],
        description: item.description || "",
        image: item.image || "",
      }));

    console.log("orderItems built:", orderItems);

    if (orderItems.length === 0) {
      setError("No items in cart. Please add items first.");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    console.log("orderData to send:", orderData);

    try {
      console.log("Making API call to:", url + "/api/order/place");
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      console.log("API Response:", response.data);

      if (response.data.success && response.data.session_url) {
        console.log("Redirecting to Stripe:", response.data.session_url);
        window.location.replace(response.data.session_url);
      } else {
        setError(
          "Order failed: " + (response.data?.message || "Unknown error")
        );
      }
    } catch (err) {
      console.log("API Error:", err);
      setError(
        "API/network error: " + (err?.response?.data?.error || err.message)
      );
    }
  };

  if (!food_list || food_list.length === 0) {
    return <div>Loading menu...</div>;
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Pin code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div>
              <div className="cart-total-details">
                <p>SubTotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <b>
                  ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                </b>
              </div>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
