import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    if (!req.body.items || !req.body.items.length) {
      console.log("No items in request");
      return res
        .status(400)
        .json({ success: false, message: "No items in order." });
    }

    console.log("Saving order to database...");
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    console.log("Order saved with ID:", newOrder._id);

    if (req.body.userId) {
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
      console.log("Cart cleared for user");
    }

    console.log("Building Stripe line_items...");
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

    // console.log("Stripe line_items:", JSON.stringify(line_items, null, 2));
    // console.log(
    //   "Using Stripe key:",
    //   process.env.STRIPE_SECRET_KEY ? "SET" : "NOT SET"
    // );

    console.log("Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log("Stripe session created:", session.url);
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Backend error:", error);
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

//user orders for frontend

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("user icd is", userId);

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId required" });
    }

    const orders = await Order.find({ userId });
    console.log("Orders are:", orders);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default userOrders;

export { placeOrder, verifyOrder, userOrders };
