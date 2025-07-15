import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://gafoor7898:raVKeTpT3xtan99Q@cluster0.w1u9om4.mongodb.net/FoodSpot"
    )
    .then(() => console.log("DB connected"));
};
