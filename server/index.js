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


// Configuring server
const app = express();
const port = process.env.PORT || 4000;

// Allow multiple origins
const allowedOrigin = ["http://localhost:5173"];

await connectDB();
await connectCloudinary();

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigin, credentials: true }));


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);


// Start server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});