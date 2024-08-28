import userHistory from '../models/userHistory.js';


export const fetchHistoryController = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        const history = await userHistory.findOne({ userId });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'No history found for the provided user ID',
            });
        }

        return res.status(200).json({
            success: true,
            data: history,
            message: 'User history retrieved successfully',
        });

    } catch (err) {
        console.error('Error fetching user history:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};
