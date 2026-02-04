import express from "express"
import userAuth from "../middleware/userAuth.js";
import { getAllOrders, getUserOrders, placeOrderCOD } from "../controllers/orderController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const orderRouter = express.Router();

orderRouter.post("/cod", userAuth, placeOrderCOD)
orderRouter.get("/user", userAuth, getUserOrders)
orderRouter.get("/seller", sellerAuth, getAllOrders)


export default orderRouter