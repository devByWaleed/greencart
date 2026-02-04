import OrderModel from "../models/Orders.js";
import ProductModel from "../models/Products.js";


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userID, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        // Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await ProductModel.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        await OrderModel.create({
            userID,
            items,
            amount,
            address,
            paymentType: "COD"
        })
        return res.json({ success: true, message: "Order placed successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Get Orders by UserID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userID } = req.body;

        const orders = await OrderModel.find({
            userID,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({createdAt: -1})

        return res.json({ success: true, orders })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Get all Orders ( for seller / admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({createdAt: -1})

        return res.json({ success: true, orders })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}