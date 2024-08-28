import userHistory from "../models/userHistory.js";
import userScores from "../models/userScores.js";
import problemSchema from "../models/problemSchema.js";
import problemsProgress from "../models/problemsProgress.js";

export const bookmarkController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

        // Fetch problem details
        const problem = await problemSchema.findOne({ Problem: problemId });
        const problemTitle = problem ? problem.Problem : 'N/A';
        const problemDifficulty = problem ? problem.Difficulty : 'N/A';

        // Update problemsProgress
        let progress = await problemsProgress.findOne({ userId });
        const timestampedBookmark = {
            value: problemId,
            timestamp: new Date()
        };

        if (!progress) {
            progress = new problemsProgress({
                userId,
                bookmarks: [timestampedBookmark]
            });
        } else {
            if (!progress.bookmarks.some(bookmark => bookmark.value === problemId)) {
                progress.bookmarks.push(timestampedBookmark);
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Problem is already bookmarked"
                });
            }
        }

        await progress.save();

        // Update userHistory
        let history = await userHistory.findOne({ userId });
        if (!history) {
            history = new userHistory({
                userId,
                data: [{
                    title: {
                        value: 'Bookmarked',
                        timestamp: new Date()
                    },
                    problem: {
                        id: problemId,
                        title: problemTitle,
                        difficulty: problemDifficulty,
                        timestamp: new Date()
                    }
                }]
            });
        } else {
            history.data.push({
                title: {
                    value: 'Bookmarked',
                    timestamp: new Date()
                },
                problem: {
                    id: problemId,
                    title: problemTitle,
                    difficulty: problemDifficulty,
                    timestamp: new Date()
                }
            });
        }
        await history.save();

        // Update userScores
        await userScores.updateOne({ userId }, { $inc: { score: 2 } }, { upsert: true });

        return res.status(200).send({
            success: true,
            message: "Problem bookmarked successfully"
        });

    } catch (err) {
        console.error("Error while bookmarking problem:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while bookmarking the problem"
        });
    }
};
export const favController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

        // Fetch problem details
        const problem = await problemSchema.findOne({ Problem: problemId });
        const problemTitle = problem ? problem.Problem : 'N/A';
        const problemDifficulty = problem ? problem.Difficulty : 'N/A';

        // Update problemsProgress
        let problemProgress = await problemsProgress.findOne({ userId });
        const timestampedFavourite = {
            value: problemId,
            timestamp: new Date()
        };

        if (!problemProgress) {
            problemProgress = new problemsProgress({
                userId,
                favourites: [timestampedFavourite]
            });
        } else {
            if (!problemProgress.favourites.some(favourite => favourite.value === problemId)) {
                problemProgress.favourites.push(timestampedFavourite);
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Problem is already favorited"
                });
            }
        }

        await problemProgress.save();

        // Update userHistory
        let history = await userHistory.findOne({ userId });
        if (!history) {
            history = new userHistory({
                userId,
                data: [{
                    title: {
                        value: 'Showed Interest',
                        timestamp: new Date()
                    },
                    problem: {
                        id: problemId,
                        title: problemTitle,
                        difficulty: problemDifficulty,
                        timestamp: new Date()
                    }
                }]
            });
        } else {
            history.data.push({
                title: {
                    value: 'Showed Interest',
                    timestamp: new Date()
                },
                problem: {
                    id: problemId,
                    title: problemTitle,
                    difficulty: problemDifficulty,
                    timestamp: new Date()
                }
            });
        }
        await history.save();

        // Update userScores
        await userScores.updateOne({ userId }, { $inc: { score: 1 } }, { upsert: true });

        return res.status(200).send({
            success: true,
            message: "Problem favorited successfully"
        });
    } catch (err) {
        console.error("Error while favoriting problem:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while favoriting the problem"
        });
    }
};



export const notesController = async (req, res) => {
    try {
        const { userId, problemId, notes } = req.body;

        // Fetch problem details
        const problem = await problemSchema.findOne({ Problem: problemId });
        const problemTitle = problem ? problem.Problem : 'N/A';
        const problemDifficulty = problem ? problem.Difficulty : 'N/A';

        // Update problemsProgress
        let problemProgress = await problemsProgress.findOne({ userId });
        const timestampedNotes = {
            value: notes,
            timestamp: new Date()
        };

        if (!problemProgress) {
            problemProgress = new problemsProgress({
                userId,
                notes: {
                    [problemId]: [timestampedNotes]
                }
            });
        } else {
            if (!problemProgress.notes.has(problemId)) {
                problemProgress.notes.set(problemId, [timestampedNotes]);
            } else {
                problemProgress.notes.get(problemId).push(timestampedNotes);
            }
        }

        await problemProgress.save();

        // Update userHistory
        let history = await userHistory.findOne({ userId });
        if (!history) {
            history = new userHistory({
                userId,
                data: [{
                    title: {
                        value: 'Added Notes',
                        timestamp: new Date()
                    },
                    problem: {
                        id: problemId,
                        title: problemTitle,
                        difficulty: problemDifficulty,
                        timestamp: new Date()
                    }
                }]
            });
        } else {
            history.data.push({
                title: {
                    value: 'Added Notes',
                    timestamp: new Date()
                },
                problem: {
                    id: problemId,
                    title: problemTitle,
                    difficulty: problemDifficulty,
                    timestamp: new Date()
                }
            });
        }
        await history.save();

        // Update userScores
        await userScores.updateOne({ userId }, { $inc: { score: 3 } }, { upsert: true });

        return res.status(200).send({
            success: true,
            message: "Note added successfully"
        });
    } catch (err) {
        console.error("Error while adding note:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while adding the note"
        });
    }
};


export const problemStatusController = async (req, res) => {
    try {
        const { userId, problemId, status } = req.body;

        const statusArrays = {
            Solved: 'solvedProblems',
            Unsolved: 'unsolvedProblems',
            Revision: 'revisionProblems'
        };

        const timestampedStatus = {
            value: problemId,
            timestamp: new Date()
        };

        // Fetch problem details
        const problem = await problemSchema.findOne({ Problem: problemId });
        const problemTitle = problem ? problem.Problem : 'N/A';
        const problemDifficulty = problem ? problem.Difficulty : 'N/A';

        let problemProgress = await problemsProgress.findOne({ userId });

        if (!problemProgress) {
            problemProgress = new problemsProgress({ userId });
        }

        // Update status arrays
        Object.keys(statusArrays).forEach(key => {
            const array = problemProgress[statusArrays[key]];
            const index = array.findIndex(entry => entry.value === problemId);
            if (index > -1) {
                array.splice(index, 1);
            }
        });

        // Add the new status
        problemProgress[statusArrays[status]].push(timestampedStatus);
        await problemProgress.save();

        // Update userHistory
        let history = await userHistory.findOne({ userId });
        if (!history) {
            history = new userHistory({
                userId,
                data: [{
                    title: {
                        value: status,
                        timestamp: new Date()
                    },
                    problem: {
                        id: problemId,
                        title: problemTitle,
                        difficulty: problemDifficulty,
                        timestamp: new Date()
                    }
                }]
            });
        } else {
            history.data.push({
                title: {
                    value: status,
                    timestamp: new Date()
                },
                problem: {
                    id: problemId,
                    title: problemTitle,
                    difficulty: problemDifficulty,
                    timestamp: new Date()
                }
            });
        }
        await history.save();

        await userScores.updateOne({ userId }, { $inc: { score: 5 } }, { upsert: true });

        return res.status(200).send({
            success: true,
            message: "Problem status updated successfully"
        });
    } catch (err) {
        console.error("Error while updating problem status:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while updating the problem status"
        });
    }
};
