import jwt from "jsonwebtoken"


// Seller login : /api/seller/login
export const sellerLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {

            const sellerToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" })

            res.cookie("sellerToken", sellerToken, {
                httpOnly: true,     // prevent Js to access cookie
                secure: process.env.NODE_ENV === "production",      // Use secure cookies in production
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",        // CSRF production
                maxAge: 7 * 24 * 3600 * 1000        // Cookie expiration time
            })

            return res.json({
                success: true,
                message: "Seller Logged In"
            })
        }
        else {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            })
        }
    }
    catch (error) {
        console.log(error.message);

        return res.json({ success: false, message: error.message })
    }
}


// Check Seller Authentication : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {

    try {
        return res.json({ success: true })
    }

    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}



// Seller logout : /api/seller/logout
export const sellerLogout = async (req, res) => {

    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({ success: true, message: "Seller Logged Out" })
    }

    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}