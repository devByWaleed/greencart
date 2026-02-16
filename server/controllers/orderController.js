import OrderModel from "../models/Orders.js";
import UserModel from "../models/Users.js";
import ProductModel from "../models/Products.js";
import stripe from "stripe"


// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userID = req.userID;

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


// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userID = req.userID;
        const { origin } = req.headers

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        let productData = []

        // Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await ProductModel.findById(item.product)
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        const order = await OrderModel.create({
            userID,
            items,
            amount,
            address,
            paymentType: "Online"
        })

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "sgd",
                    product_data: {
                        name: item.name,
                    },
                    // Stripe is charging almost nothing
                    unit_amount: Math.floor(item.price * 1.02 * 100)
                },
                quantity: item.quantity
            }
        })

        // Create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userID
            }
        })

        return res.json({ success: true, url: session.url })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Stripe Webhooks to verify payments action : /stripe
export const stripeWebhooks = async (req, res) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body, // This MUST be the raw buffer
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("❌ Webhook Signature Failed:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { orderId, userID } = session.metadata;

        try {
            if (orderId && userID) {
                // Use Promise.all to run both updates in parallel for speed
                await Promise.all([
                    OrderModel.findByIdAndUpdate(orderId, { isPaid: true }),
                    UserModel.findByIdAndUpdate(userID, { cartItems: {} })
                ]);
                console.log(`✅ Order ${orderId} updated successfully.`);
            }
        } catch (dbError) {
            console.error("❌ Database Update Failed:", dbError.message);
            // Return a 500 so Stripe knows to retry the webhook later
            return res.status(500).json({ success: false });
        }
    }

    res.status(200).json({ received: true });
};


/*
export const stripeWebhooks = async (req, res) => {
    // Stripe gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers["stripe-signature"]
    let event

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handling the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const { orderId, userID } = session.data[0].metadata

            // Update paid status
            await OrderModel.findByIdAndUpdate(orderId, { isPaid: true })
            
            // Clear user cart
            await UserModel.findByIdAndUpdate(userID, { cartItems: {} })
            break;
        }
        
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object
            const paymentIntentId = paymentIntent.id

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            if (!session.data.length) break

            const { orderId } = session.data[0].metadata

            // Delete the order
            await OrderModel.findByIdAndUpdate(orderId, { isPaid: false })
            break;
        }


        default:
            console.error(`Unhandled event type ${event.type}`);
            break;
    }
    res.json({ received: true })
}
*/





// Get Orders by UserID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userID = req.userID;

        const orders = await OrderModel.find({
            userID,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })

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
        }).populate("items.product address").sort({ createdAt: -1 })

        return res.json({ success: true, orders })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}