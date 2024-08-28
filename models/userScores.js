import mongoose from 'mongoose';

// Define the schema for the objects in the array
const ScoreSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    }
});
const UserScoresSchema = new mongoose.Schema({
    scores: {
        type: [ScoreSchema],
        required: true,
        default: []
    }
});

export default mongoose.model('userScores', UserScoresSchema);
