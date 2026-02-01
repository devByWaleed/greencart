import express from "express"
import sellerAuth from "../middleware/sellerAuth.js";
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/sellerController.js";

const sellerRouter = express.Router();

// sellerRouter.post("/register", register)
sellerRouter.post("/login", sellerLogin)
sellerRouter.get("/is-auth", sellerAuth, isSellerAuth)
// sellerAuth to be checked for this
sellerRouter.get("/logout", sellerLogout)

export default sellerRouter