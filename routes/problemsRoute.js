import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
    Topic: String,
    Problem: String,
    Done: String,
    URL: String,
});


export default mongoose.model('problemSchema', problemSchema);
