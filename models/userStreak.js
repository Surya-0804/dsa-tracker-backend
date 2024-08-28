import mongoose from 'mongoose';

const DailyLoginSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
}, { _id: false });

const MonthlyLoginSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    logins: [DailyLoginSchema]
}, { _id: false });

const YearlyLoginSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true
    },
    months: [MonthlyLoginSchema]
}, { _id: false });

const UserLoginSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    years: [YearlyLoginSchema]
}, { timestamps: true });

export default mongoose.model('userStreak', UserLoginSchema);;