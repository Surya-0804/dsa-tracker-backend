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
        return res.status(500).send({
            success: false,
            message: "An error occurred while bookmarking the problem"
        });
    }
};
export const favController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemId });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Check if the user already exists in favorites to prevent duplication
        if (!problem.favourites.includes(userId)) {
            // Add user to favorites array
            problem.favourites.push(userId);
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

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemId });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Initialize an empty array if the user's notes map doesn't exist
        if (!problem.notes.has(userId)) {
            problem.notes.set(userId, []);
        }

        // Add the note to the user's notes array for this problem
        problem.notes.get(userid).push(note);

        // Save the updated problem document
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

        // Define the arrays to check and update
        const statusArrays = {
            solved: 'solvedProblems',
            unsolved: 'unsolvedProblems',
            revision: 'revisionProblems'
        };

        // Validate status
        if (!statusArrays[status]) {
            return res.status(400).send({
                success: false,
                message: "Invalid status provided"
            });
        }

        // Find the problem by its userId
        let problem = await problemsProgress.findOne({ userId });

        if (!problem) {
            // If user progress not found, create a new document
            problem = new problemsProgress({ userId });
        }

        // Check if the problemId is already in the specified status array
        if (problem[statusArrays[status]].includes(problemId)) {
            return res.status(200).send({
                success: true,
                message: `Problem is already marked as ${status}`
            });
        }

        // Remove the problemId from all arrays
        Object.keys(statusArrays).forEach(key => {
            const array = problem[statusArrays[key]];
            const index = array.indexOf(problemId);
            if (index > -1) {
                array.splice(index, 1);
            }
        });

        // Add the problemId to the appropriate array based on status
        problem[statusArrays[status]].push(problemId);

        // Save the updated problem document
        await problem.save();

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