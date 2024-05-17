import mongoose from 'mongoose';

const userProgress = new mongoose.Schema({
    userid: String,
    problemid: String,
    article: String,
    notes: String,
    revision: String,
    bookmarked: String,
    status: String,
});


export default mongoose.model('userprogress', userProgress);
