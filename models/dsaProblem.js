import mongoose from 'mongoose';

const dsaproblem = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    bookmarks: {
        type: [String],
        default: []
    },
    favourites: {
        type: [String],
        default: {}
    },
    notes: {
        type: [String],
        default: {}
    },
    solutions: {
        type: [String],
        default: []
    },
    problemSolved: {
        type: [String],
        default: []
    },
    problemForRevision: {
        type: [String],
        default: []
    }
});
export default mongoose.model('dsaproblem', dsaproblem);