import mongoose from "mongoose"
import userAuth from "../middleware/userAuth.js";
import { updateCart } from "../controllers/cartController.js";

const cartRouter = mongoose.Router();

cartRouter.post("/update", userAuth, updateCart)


export default cartRouter