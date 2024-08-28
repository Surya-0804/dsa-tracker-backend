import userHistory from '../models/userHistory';
import dsaTracker from '../models/dsaTracker'; // Assuming this is your DSA tracker model

export const historyController = async (req, res) => {
    try {
        const { userId, problemId, problemTitle, problemDifficulty } = req.body;

        // Check if userId and problemId are present
        if (!userId || !problemId || !problemTitle || !problemDifficulty) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, problemId, problemTitle, and problemDifficulty are required.',
            });
        }

        let userHistoryDoc = await userHistory.findOne({ userId });

        if (!userHistoryDoc) {
            userHistoryDoc = new userHistory({ userId, data: [] });
        }

        const existingProblem = userHistoryDoc.data.find(
            (entry) => entry.problem.id === problemId
        );

        if (!existingProblem) {
            userHistoryDoc.data.push({
                title: { value: problemTitle },
                problem: {
                    id: problemId,
                    title: problemTitle,
                    difficulty: problemDifficulty,
                },
            });

            await userHistoryDoc.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Problem added to user history successfully.',
        });
    } catch (err) {
        console.error('Error updating user history:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
