import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to MongoDB Successfully ${conn.connection.host} `.green);
    }
    catch (err) {
        console.log(`Error connecting to MongoDB`.red);
    }
}

export default connectDB;