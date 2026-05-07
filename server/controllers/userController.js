import UserModel from "../models/Users.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";


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

        return res.json({ success: true, user })
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


// Password reset OTP : /api/user/send-reset-otp
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        })
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // Generating OTP, guaranteed 6 digits
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        const resetToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' })
        res.cookie('resetToken', resetToken, { httpOnly: true, maxAge: 10 * 60 * 1000 })

        // Sending OTP reset email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP Is ${otp}. Reset your password using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP send to your email" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// Verify Reset OTP : /api/user/verify-reset-otp
export const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    const { resetToken } = req.cookies;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    if (!resetToken) {
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        if (decoded.email !== email) {
            return res.json({ success: false, message: "Invalid request" });
        }

        if (decoded.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP. Please try again." });
        }

        // OTP is correct — issue a verified token so reset-password knows OTP was checked
        const verifiedToken = jwt.sign(
            { email, otpVerified: true },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.cookie('resetVerified', verifiedToken, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        // Clear the OTP token — it's been used
        res.clearCookie('resetToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "OTP verified" });

    } catch (error) {
        // jwt.verify throws if token is expired
        return res.json({ success: false, message: "OTP expired. Please request a new one." });
    }
}


// Reset user password : /api/user/reset-password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const { resetVerified } = req.cookies;

    if (!email || !newPassword) {
        return res.json({
            success: false,
            message: "Email,OTP, new password is required"
        })
    }

    if (!resetVerified) {
        return res.json({
            success: false,
            message: "OTP not verified. Please start over."
        });
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const decoded = jwt.verify(resetVerified, process.env.JWT_SECRET);

        if (!decoded.otpVerified || decoded.email !== email) {
            return res.json({ success: false, message: "Unauthorized. Please verify your OTP first." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword

        await user.save();

        // Clean up the verified cookie
        res.clearCookie('resetVerified', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.json({ success: true, message: "Password has been reset successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}