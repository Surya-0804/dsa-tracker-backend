import mongoose from 'mongoose';


const UserScoresSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
    },
    score: {
        type: Number,
    }
});

export default mongoose.model('userScores', UserScoresSchema);
