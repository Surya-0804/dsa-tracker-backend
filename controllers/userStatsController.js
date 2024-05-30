import dsaTracker from "../models/problemSchema.js";
import users from '../models/users.js';
import userProblems from '../models/userProblems.js'

export const getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userProblems) {
            return res.status(404).json({ message: "User problems not found" });
        }

        // Fetch all problems
        const problems = await Problem.find();

        // Initialize stats
        let totalProblems = 0;
        let totalFavourites = 0;
        let totalNotes = 0;
        let totalSolutions = 0;
        let totalProblemsSolved = 0;
        let totalProblemsForRevision = 0;
        let easyProblems = 0;
        let mediumProblems = 0;
        let hardProblems = 0;

        // Iterate through each problem and calculate stats
        for (const problem of problems) {
            totalProblems++;

            if (userProblems.favourites.includes(problem._id)) {
                totalFavourites++;
            }

            if (userProblems.notes.has(problem._id)) {
                totalNotes += userProblems.notes.get(problem._id).length;
            }

            if (userProblems.solutions.includes(problem._id)) {
                totalSolutions++;
            }

            if (userProblems.problemSolved.includes(problem._id)) {
                totalProblemsSolved++;
            }

            if (userProblems.problemForRevision.includes(problem._id)) {
                totalProblemsForRevision++;
            }

            switch (problem.Difficulty.toLowerCase()) {
                case 'easy':
                    easyProblems++;
                    break;
                case 'medium':
                    mediumProblems++;
                    break;
                case 'hard':
                    hardProblems++;
                    break;
                default:
                    break;
            }
        }

        // Construct stats object
        const stats = {
            totalProblems,
            totalFavourites,
            totalNotes,
            totalSolutions,
            totalProblemsSolved,
            totalProblemsForRevision,
            difficultyStats: {
                easy: easyProblems,
                medium: mediumProblems,
                hard: hardProblems
            }
        };

        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
