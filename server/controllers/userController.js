import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


// User registration : /api/user/register
export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ name, email, password: hashedPassword })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,     // prevent Js to access cookie
            secure: process.env.NODE_ENV === "production",      // Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",        // CSRF production
            maxAge: 7 * 24 * 3600 * 1000        // Cookie expiration time
        })


        return res.json({ success: true, user: { email: user.email, name: user.name } })
    }

    catch (error) {
        console.log(error.message);

        return res.json({ success: false, message: error.message })
    }
}


// User login : /api/user/login
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and Password are required"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000 })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
    }

    catch (error) {
        console.log(error.message);
        
        return res.json({ success: false, message: error.message })
    }
}


// Check User Authentication : /api/user/is-auth
export const isAuth = async (req, res) => {

    try {
        // const { userID } = req.body;
        const userID = req.userID;

        const user = await UserModel.findById(userID).select("-password")

        return res.json({ success: true, user})
    }

    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}


// User logout : /api/user/logout
export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({ success: true, message: "Logged Out" })
    }

    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}