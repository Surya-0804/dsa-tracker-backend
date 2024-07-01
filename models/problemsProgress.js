import mongoose from 'mongoose';

const problemsProgress = new mongoose.Schema({
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
        default: []
    },
    notes: {
        type: Map,
        of: [String],
        default: {}
    },
    solutions: {
        type: Map,
        of: [String],
        default: {}
    },
    solvedProblems: {
        type: [String],
        default: []
    },
    revisionProblems: {
        type: [String],
        default: []
    }
});
export default mongoose.model('problemsProgress', problemsProgress);