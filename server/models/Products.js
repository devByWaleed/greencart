import mongoose from "mongoose"

// Creating user schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, default: true },
    inStock: { type: Boolean, default: true },
}, { timestamps: true })


// .model gets collection name & schema
const ProductModel = mongoose.models.product || mongoose.model("product", ProductSchema)


// Exporting the model
export default ProductModel