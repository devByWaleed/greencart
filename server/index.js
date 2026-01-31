import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import "dotenv/config"


// Configuring server
const app = express()
const port = process.env.PORT || 4000

// Allow multiple origins
const allowedOrigin = ["http://localhost:5173"]

await connectDB()

// Middleware configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigin, credentials: true }))


// API endpoints
app.get('/', (req, res) => res.send("API Working!!!"));


// Start server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
})