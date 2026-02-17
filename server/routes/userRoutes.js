import express from "express"
import userAuth from "../middleware/userAuth.js";
import { isAuth, login, logout, register } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/is-auth", userAuth, isAuth)
userRouter.get("/logout", userAuth, logout)

export default userRouter