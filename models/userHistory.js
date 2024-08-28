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

const ProblemSchema = new mongoose.Schema({
    title: {
        type: TimestampedStringSchema,
        required: true
    },
    problem: {
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
}, { _id: false });

const userHistory = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    data: [ProblemSchema]
});

export default mongoose.model('userHistory', userHistory);