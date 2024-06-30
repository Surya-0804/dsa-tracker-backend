import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import path from 'path';
import bodyParser from "body-parser";

import connectDB from "./config/db.js";
import dsaTrackerRoute from "./routes/dsaTrackerRoute.js";
import authRoute from './routes/authRoute.js';
import corsHandler from "./allowCors.js";

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Middleware for logging requests
app.use(morgan('dev'));

// CORS setup
const corsOptions = {
  origin: [process.env.CLIENT_URL, 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000', 'https://dsa-tracker-website.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Use CORS handler middleware if you need to set custom headers


// Define your routes
app.use("/", dsaTrackerRoute);
app.use("/auth", authRoute);

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Backend server started at port ${PORT}`.green);
});
