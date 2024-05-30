import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
    problemId: {
        type: String,
        required: true,
        unique: true
    },
    solutions: {
        type: Map,
        of: [String],
        default: {}
    }
});
export default mongoose.model('solutions', SolutionSchema);