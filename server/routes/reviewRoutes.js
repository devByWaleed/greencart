import express from "express"
import userAuth from "../middleware/userAuth.js"
import { addReview, getProductReviews, checkUserReview } from "../controllers/reviewController.js"

const reviewRouter = express.Router()

reviewRouter.post("/add", userAuth, addReview)
reviewRouter.get("/check/:productID", userAuth, checkUserReview)
reviewRouter.get("/:productID", getProductReviews)

export default reviewRouter