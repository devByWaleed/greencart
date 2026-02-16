import express from "express"
import userAuth from "../middleware/userAuth.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe, stripeWebhooks } from "../controllers/orderController.js";
import sellerAuth from "../middleware/sellerAuth.js";


const orderRouter = express.Router();

orderRouter.post("/cod", userAuth, placeOrderCOD)
orderRouter.post("/stripe", userAuth, placeOrderStripe)
orderRouter.get("/user", userAuth, getUserOrders)
orderRouter.get("/seller", sellerAuth, getAllOrders)
orderRouter.post("/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhooks);


export default orderRouter