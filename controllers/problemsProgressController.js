import problemsProgress from "../models/problemsProgress.js";

export const bookmarkController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;
        console.log(problemId)

        let progress = await problemsProgress.findOne({ userId });

        if (!progress) {
            progress = new problemsProgress({
                userId,
                bookmarks: [problemId]
            });
        } else {
            if (!progress.bookmarks.includes(problemId)) {
                progress.bookmarks.push(problemId);
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
        return res.status(200).send({
            success: true,
            message: "An error occurred while bookmarking the problem"
        });
    }
};
export const favController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ userId });

        if (!problem) {
            problem = new problemsProgress({
                userId,
                favourites: [problemId]
            });
            await problem.save();
            return res.status(200).send({
                success: true,
                message: "successfull"
            });
        }

        // Check if the user already exists in favorites to prevent duplication
        if (!problem.favourites.includes(problemId)) {
            // Add user to favorites array
            problem.favourites.push(problemId);
        } else {
            // If user already in favorites, return success message
            return res.status(200).send({
                success: true,
                message: "Problem is already favorited"
            });
        }

        // Save the updated problem document
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
        const { userId, problemId, note } = req.body;

        const problem = await problemsProgress.findOne({ problemId });

        if (!problem) {
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        if (!problem.notes.has(userId)) {
            problem.notes.set(userId, []);
        }

        problem.notes.get(userid).push(note);

        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Note added successfully"
        });
    } catch (err) {
        console.error("Error while adding note:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while adding the note",
            error: err.message
        });
    }
};

export const problemStatusController = async (req, res) => {
    try {
        const { userId, problemId, status } = req.body;
        console.log(status)
        const statusArrays = {
            Solved: 'solvedProblems',
            Unsolved: 'unsolvedProblems',
            Revision: 'revisionProblems'
        };


        // Find the problem progress by userId
        let problemProgress = await problemsProgress.findOne({ userId });

        if (!problemProgress) {
            // If user progress not found, create a new document
            problemProgress = new problemsProgress({ userId });
            problemProgress[statusArrays[status]].push(problemId);
            await problemProgress.save();
            return res.status(200).send({
                success: true,
                message: `Problem is marked as ${status}`
            });
        }

        // Check if the problemId is already in the specified status array
        if (problemProgress[statusArrays[status]].includes(problemId)) {
            return res.status(200).send({
                success: true,
                message: `Problem is already marked as ${status}`
            });
        }

        // Remove the problemId from all arrays
        Object.keys(statusArrays).forEach(key => {
            const array = problemProgress[statusArrays[key]];
            const index = array.indexOf(problemId);
            if (index > -1) {
                array.splice(index, 1);
            }
        });

        // Add the problemId to the appropriate array based on status
        problemProgress[statusArrays[status]].push(problemId);

        // Save the updated problem document
        await problemProgress.save();

        return res.status(200).send({
            success: true,
            message: `Problem marked as ${status} successfully`
        });
    } catch (err) {
        console.error("Error while marking problem status:", err);
        return res.status(200).send({
            success: true,
            message: "An error occurred while updating the problem status"
        });
    }
};