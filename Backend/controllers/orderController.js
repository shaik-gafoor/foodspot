import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    // ✅ CRITICAL FIX: Get userId from middleware
    const userId = req.userId; // This was missing!

    // Add debug logging
    console.log("UserId from middleware:", userId);
    console.log("Request body:", req.body);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.body.items || !req.body.items.length) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order." });
    }

    console.log("Saving order to database...");
    const newOrder = new orderModel({
      userId: userId, // ✅ FIXED: Now using userId from middleware
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // ✅ FIXED: Use userId from middleware, not req.body.userId
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("Cart cleared for user");

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Place order error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error", error: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const userOrders = async (req, res) => {
  try {
    console.log("Decoded userId from middleware:", req.userId);

    const userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    console.log("Orders found:", orders);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

//isting orders for  admin pannel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
