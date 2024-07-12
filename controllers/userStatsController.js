import problemsProgress from "../models/problemsProgress.js";
import dsaTracker from "../models/problemSchema.js";

export const completeUserStats = async (req, res) => {
    try {
        const { userId } = req.body;

        const userProblems = await problemsProgress.findOne({ userId });
        if (!userProblems) {
            userProblems = new problemsProgress({
                userId,
                bookmarks: [],
                favourites: [],
                notes: new Map(),
                solutions: new Map(),
                solvedProblems: [],
                unsolvedProblems: [],
                revisionProblems: []
            });

            await userProblems.save();
        }
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

        // Calculate stats from the user's problem progress
        totalProblems = 450;
        totalFavourites = userProblems.favourites.length;

        userProblems.notes.forEach(noteArray => {
            totalNotes += noteArray.length;
        });

        userProblems.solutions.forEach(solutionArray => {
            totalSolutions += solutionArray.length;
        });

        totalProblemsSolved = userProblems.solvedProblems.length;
        totalProblemsForRevision = userProblems.revisionProblems.length;

        const stats = {
            totalProblems,
            totalFavourites,
            totalNotes,
            totalSolutions,
            totalProblemsSolved,
            totalProblemsForRevision,
        };
        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const completeUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = problemsProgress.findOne({ userId });
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const topicWiseStats = async (req, res) => {
    try {
        const { userId } = req.body;

        let userProblems = await problemsProgress.findOne({ userId });
        if (!userProblems) {
            userProblems = new problemsProgress({
                userId,
                bookmarks: [],
                favourites: [],
                notes: new Map(),
                solutions: new Map(),
                solvedProblems: [],
                unsolvedProblems: [],
                revisionProblems: []
            });

            await userProblems.save();
        }

        const solvedProblems = userProblems.solvedProblems;

        const topicWiseCount = {};
        const easyProblems = [];
        const mediumProblems = [];
        const hardProblems = [];

        for (const problemId of solvedProblems) {
            const problem = await dsaTracker.findOne({ _id: problemId });
            if (problem) {

                if (topicWiseCount[problem.Topic]) {
                    topicWiseCount[problem.Topic]++;
                } else {
                    topicWiseCount[problem.Topic] = 1;
                }

                const problemInfo = { id: problem._id, title: problem.Problem };
                if (problem.Difficulty === 'Easy') {
                    easyProblems.push(problemInfo);
                } else if (problem.Difficulty === 'Medium') {
                    mediumProblems.push(problemInfo);
                } else if (problem.Difficulty === 'Hard') {
                    hardProblems.push(problemInfo);
                }
            }
        }

        const stats = {
            topicWiseCount,
            problemsByDifficulty: {
                Easy: easyProblems,
                Medium: mediumProblems,
                Hard: hardProblems,
            }
        };

        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};