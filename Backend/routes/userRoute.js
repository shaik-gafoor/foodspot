import express from "express";
import { registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
