import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import "dotenv/config"
import userRouter from "./routes/userRoutes.js"
import sellerRouter from "./routes/sellerRoutes.js"
import connectCloudinary from "./config/cloudinary.js"
import productRouter from "./routes/productRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import addressRouter from "./routes/addressRoutes.js"
import orderRouter from "./routes/orderRoutes.js"


// Configuring server
const app = express();
const port = process.env.PORT || 4000;


// Allow multiple origins
const allowedOrigin = ["http://localhost:5173", "https://grocery-eta-six.vercel.app"];
app.use(cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    credentials: true
}));

app.use(cookieParser());

// Contains Stripe raw webhook
app.use('/api/order', orderRouter);

// Middleware configuration
app.use(express.json());


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);


await connectDB();
await connectCloudinary();


// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}


// Exporting for vercel configuration
export default app;