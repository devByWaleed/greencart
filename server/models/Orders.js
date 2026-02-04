import mongoose from "mongoose"

// Creating user schema
const OrderSchema = new mongoose.Schema({
    userID: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: 'address' },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
}, { timestamps: true });


// .model gets collection name & schema
const OrderModel = mongoose.models.order || mongoose.model("order", OrderSchema);


// Exporting the model
export default OrderModel;