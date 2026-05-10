import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
}, { timestamps: true })

// Prevent same user reviewing same product twice
// This creates a unique index on the combination
ReviewSchema.index({ userID: true, productID: true }, { unique: true })

const ReviewModel = mongoose.models.review || mongoose.model("review", ReviewSchema)

export default ReviewModel