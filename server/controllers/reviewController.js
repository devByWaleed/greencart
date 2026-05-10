import ReviewModel from "../models/Reviews.js"
import ProductModel from "../models/Products.js"
import OrderModel from "../models/Orders.js"


// Add Review : /api/review/add
export const addReview = async (req, res) => {
    try {
        const { productID, stars, comment } = req.body
        const userID = req.userID

        if (!productID || !stars || !comment) {
            return res.json({ success: false, message: "All fields are required" })
        }

        // Check user actually ordered this product
        const order = await OrderModel.findOne({
            userID,
            "items.product": productID,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })

        if (!order) {
            return res.json({
                success: false,
                message: "You can only review products you have ordered"
            })
        }

        // Check if already reviewed
        const existingReview = await ReviewModel.findOne({ userID, productID })

        if (existingReview) {
            return res.json({
                success: false,
                message: "You have already reviewed this product"
            })
        }

        // Save review
        await ReviewModel.create({ userID, productID, stars, comment })

        // Recalculate average rating on the product
        const allReviews = await ReviewModel.find({ productID })
        const reviewCount = allReviews.length
        const averageRating = allReviews.reduce((sum, r) => sum + r.stars, 0) / reviewCount

        await ProductModel.findByIdAndUpdate(productID, {
            averageRating: Math.round(averageRating * 10) / 10, // round to 1 decimal e.g 4.3
            reviewCount
        })

        return res.json({ success: true, message: "Review submitted successfully" })

    } catch (error) {
        // Handle duplicate review attempt at DB level
        if (error.code === 11000) {
            return res.json({ success: false, message: "You have already reviewed this product" })
        }
        return res.json({ success: false, message: error.message })
    }
}


// Get reviews for a product : /api/review/:productID
export const getProductReviews = async (req, res) => {
    try {
        const { productID } = req.params

        const reviews = await ReviewModel.find({ productID })
            .populate("userID", "name")   // only fetch name from user, not password etc
            .sort({ createdAt: -1 })      // newest first

        return res.json({ success: true, reviews })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Check if current user can review / already reviewed : /api/review/check/:productID
export const checkUserReview = async (req, res) => {
    try {
        const { productID } = req.params
        const userID = req.userID

        // Did user order this product?
        const order = await OrderModel.findOne({
            userID,
            "items.product": productID,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })

        const hasOrdered = !!order

        // Did user already review?
        const existingReview = await ReviewModel.findOne({ userID, productID })

        return res.json({
            success: true,
            hasOrdered,
            existingReview: existingReview || null
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}