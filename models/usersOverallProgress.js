import mongoose from 'mongoose';

const userOverallProgress = new mongoose.Schema({
    userid: String,
    totalProblems: {
        type: Number,
        default: 0
    },
    totalSolved: {
        type: Number,
        default: 0
    }
    ,
    totalTried: {
        type: Number,
        default: 0
    },
    totalBookmarked: {
        type: Number,
        default: 0
    },
    markedForRevision: {
        type: Number,
        default: 0
    },
    totalNotes: {
        type: Number,
        default: 0
    }
});


export default mongoose.model('useroverallprogress', userOverallProgress);
