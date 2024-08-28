import problemsProgress from "../models/problemsProgress.js";

export const bookmarkController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

        let progress = await problemsProgress.findOne({ userId });

        const timestampedBookmark = {
            value: problemId,
            timestamp: new Date()
        };
        console.log(timestampedBookmark)
        if (!progress) {
            progress = new problemsProgress({
                userId,
                bookmarks: [timestampedBookmark]
            });
            console.log(progress)
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

        let problem = await problemsProgress.findOne({ userId });

        const timestampedFavourite = {
            value: problemId,
            timestamp: new Date()
        };

        if (!problem) {
            problem = new problemsProgress({
                userId,
                favourites: [timestampedFavourite]
            });
        } else {
            if (!problem.favourites.some(favourite => favourite.value === problemId)) {
                problem.favourites.push(timestampedFavourite);
            } else {
                return res.status(200).send({
                    success: true,
                    message: "Problem is already favorited"
                });
            }
        }

        await problem.save();

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

        let problem = await problemsProgress.findOne({ userId });

        const timestampedNotes = {
            value: notes,
            timestamp: new Date()
        };

        if (!problem) {
            problem = new problemsProgress({
                userId,
                notes: {
                    [problemId]: [timestampedNotes]
                }
            });
        } else {
            if (!problem.notes.has(problemId)) {
                problem.notes.set(problemId, [timestampedNotes]);
            } else {
                problem.notes.get(problemId).push(timestampedNotes);
            }
        }

        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Note added successfully",
            notes: problem.notes
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

        let problemProgress = await problemsProgress.findOne({ userId });

        if (!problemProgress) {
            problemProgress = new problemsProgress({ userId });
            problemProgress[statusArrays[status]].push(timestampedStatus);
        } else {
            if (problemProgress[statusArrays[status]].some(entry => entry.value === problemId)) {
                return res.status(200).send({
                    success: true,
                    message: `Problem is already marked as ${status}`
                });
            }

            Object.keys(statusArrays).forEach(key => {
                const array = problemProgress[statusArrays[key]];
                const index = array.findIndex(entry => entry.value === problemId);
                if (index > -1) {
                    array.splice(index, 1);
                }
            });

            problemProgress[statusArrays[status]].push(timestampedStatus);
        }

        await problemProgress.save();

        return res.status(200).send({
            success: true,
            message: `Problem marked as ${status} successfully`
        });
    } catch (err) {
        console.error("Error while marking problem status:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while updating the problem status"
        });
    }
};
