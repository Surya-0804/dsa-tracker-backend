import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    notes: {
        type: Map,
        of: [String],
        default: {}
    }
});
export default mongoose.model('notes', notesSchema);