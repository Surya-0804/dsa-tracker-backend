import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    isGoogleUser: {
        type: Boolean
    },
    googleUid: {
        type: String,
    },
    photoUrl: {
        type: String,
    }
});

export default mongoose.model('users', userSchema);