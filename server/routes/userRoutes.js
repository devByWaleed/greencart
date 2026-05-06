import express from "express"
import userAuth from "../middleware/userAuth.js";
import { isAuth, login, logout, register, resetPassword, sendResetOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/is-auth", userAuth, isAuth)
userRouter.get("/logout", userAuth, logout)
userRouter.post('/send-reset-otp', sendResetOTP)
userRouter.post('/reset-password', resetPassword)

export default userRouter