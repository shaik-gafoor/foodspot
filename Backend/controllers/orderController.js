import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  console.log("Backend: placeOrder called");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

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

    console.log("Stripe line_items:", JSON.stringify(line_items, null, 2));
    console.log(
      "Using Stripe key:",
      process.env.STRIPE_SECRET_KEY ? "SET" : "NOT SET"
    );

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

export { placeOrder };
