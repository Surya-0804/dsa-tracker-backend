import problemsProgress from "../models/problemsProgress.js";

export const bookmarkController = async (req, res) => {
    try {
        const { userId, problemId } = req.body;

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
        const { userid, problemid } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemid });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Check if the user already exists in favorites to prevent duplication
        if (!problem.favourites.includes(userid)) {
            // Add user to favorites array
            problem.favourites.push(userid);
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
        const { userid, problemid, note } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemid });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Initialize an empty array if the user's notes map doesn't exist
        if (!problem.notes.has(userid)) {
            problem.notes.set(userid, []);
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

export const solvedProblemsController = async (req, res) => {
    try {
        const { userid, problemid } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemid });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Check if the user already exists in problemSolved to prevent duplication
        if (!problem.solvedProblems.includes(userid)) {
            // Add user to problemSolved array
            problem.solvedProblems.push(userid);
        } else {
            // If user already in problemSolved, return success message
            return res.status(200).send({
                success: true,
                message: "Problem is already marked as solved"
            });
        }

        // Save the updated problem document
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Problem marked as solved successfully"
        });
    } catch (err) {
        console.error("Error while marking problem as solved:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while marking the problem as solved"
        });
    }
};

export const revisionProblemsController = async (req, res) => {
    try {
        const { userid, problemid } = req.body;

        // Find the problem by its ID
        const problem = await problemsProgress.findOne({ problemid });

        if (!problem) {
            // If problem not found, return 404
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        // Check if the user already exists in problemForRevision to prevent duplication
        if (!problem.revisionProblems.includes(userid)) {
            // Add user to problemForRevision array
            problem.revisionProblems.push(userid);
        } else {
            // If user already in problemForRevision, return success message
            return res.status(200).send({
                success: true,
                message: "Problem is already marked for revision"
            });
        }

        // Save the updated problem document
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Problem marked for revision successfully"
        });
    } catch (err) {
        console.error("Error while marking problem for revision:", err);
        return res.status(500).send({
            success: false,
            message: "An error occurred while marking the problem for revision"
        });
    }
};