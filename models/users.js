import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    address: {
        type: String
    },

});

export default mongoose.model('users', userSchema);