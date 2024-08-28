import mongoose from 'mongoose';

const TimestampedStringSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const TimestampedArraySchema = new mongoose.Schema({
    value: {
        type: [String],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const ProblemsProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true  // Adding an index can help with query performance
    },
    bookmarks: {
        type: [TimestampedStringSchema],
        default: []
    },
    favourites: {
        type: [TimestampedStringSchema],
        default: []
    },
    notes: {
        type: Map,
        of: [TimestampedArraySchema],
        default: {}
    },
    solutions: {
        type: Map,
        of: [TimestampedArraySchema],
        default: {}
    },
    solvedProblems: {
        type: [TimestampedStringSchema],
        default: []
    },
    unsolvedProblems: {
        type: [TimestampedStringSchema],
        default: []
    },
    revisionProblems: {
        type: [TimestampedStringSchema],
        default: []
    }
});

export default mongoose.model('ProblemsProgress', ProblemsProgressSchema);
