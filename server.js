import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import path from 'path';
import bodyParser from "body-parser";

import connectDB from "./config/db.js";

// import authRoute from "./routes/authRoute.js";
import dsaTrackerRoute from "./routes/dsaTrackerRoute.js";

// import insertData from "./data/addData.js";

const app = express();

connectDB();

// insertData();

dotenv.config()

app.use(cors());
// Parses JSON data in incoming requests.
app.use(express.json());
// Logs HTTP requests in a developer-friendly format.
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use("/", dsaTrackerRoute);

// app.use("/auth", authRoute);

app.listen(process.env.PORT, () => {
    console.log(`BE started at port ${process.env.PORT}`);
})