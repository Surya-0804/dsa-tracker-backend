import problemsProgress from "../models/problemsProgress.js";
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
        totalProblems = userProblems.bookmarks.length + userProblems.solvedProblems.length + userProblems.unsolvedProblems.length + userProblems.revisionProblems.length;
        totalFavourites = userProblems.favourites.length;

        userProblems.notes.forEach(noteArray => {
            totalNotes += noteArray.length;
        });

        userProblems.solutions.forEach(solutionArray => {
            totalSolutions += solutionArray.length;
        });

        totalProblemsSolved = userProblems.solvedProblems.length;
        totalProblemsForRevision = userProblems.revisionProblems.length;

        // Assuming that you have some way to determine the difficulty level of the problems

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

