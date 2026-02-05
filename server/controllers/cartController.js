import UserModel from "../models/Users.js";



// Update user cart : /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userID = req.userID;

        await UserModel.findByIdAndUpdate(userID, { cartItems });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}