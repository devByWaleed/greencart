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
import { stripeWebhooks } from "./controllers/orderController.js"


// Configuring server
const app = express();
const port = process.env.PORT || 4000;

// Allow multiple origins
const allowedOrigin = ["http://localhost:5173", "https://grocery-eta-six.vercel.app"];

// 2. Configure CORS Options
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
};

// 3. APPLY MIDDLEWARE
app.use(cors(corsOptions));

// Handle pre-flight (OPTIONS) requests globally
app.options('*', cors(corsOptions));

// Configure Webhhoks
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

await connectDB();
await connectCloudinary();

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);


// Start server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
});