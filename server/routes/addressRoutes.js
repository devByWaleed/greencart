import express from "express"
import userAuth from "../middleware/userAuth.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

const addressRouter = express.Router();


addressRouter.post("/add", userAuth, addAddress)
addressRouter.get("/get", userAuth, getAddress)

export default addressRouter