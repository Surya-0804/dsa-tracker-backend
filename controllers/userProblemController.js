import userSchema from "../../models/auth/userSchema.js";
import postSchema from "../../models/vishnu/postSchema.js";
import userProblemSchema from "../../models/vishnu/userPostsSchema.js";

export const bookmarkProblemController = async (req, res) => {
    try {
        const { userid, problemid } = req.query;

        const problem = await userProblemSchema.findById(problemid);
        if (!problem) {
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        problem.bookmarks.push(userid);
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Problem bookmarked successfully"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "An error occurred while bookmarking the problem"
        });
    }
};
export const myFavController = async (req, res) => {
    try {
        const { userid, problemid } = req.query;

        const problem = await userProblemSchema.findById(problemid);
        if (!problem) {
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        problem.favourites.push(userid);
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Problem bookmarked successfully"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "An error occurred while bookmarking the problem"
        });
    }
};

export const solutionsController = async (req, res) => {
    try {
        const { userid, problemid } = req.query;

        const problem = await userProblemSchema.findById(problemid);
        if (!problem) {
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        problem.solutions.push(userid);
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Problem bookmarked successfully"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "An error occurred while bookmarking the problem"
        });
    }
};

export const notesController = async (req, res) => {
    try {
        const { userid, problemid, note } = req.query;

        const problem = await userProblemSchema.findById(problemid);
        if (!problem) {
            return res.status(404).send({
                success: false,
                message: "Problem not found"
            });
        }

        if (!problem.notes.has(userid)) {
            problem.notes.set(userid, []);
        }

        problem.notes.get(userid).push(note);
        await problem.save();

        return res.status(200).send({
            success: true,
            message: "Note added successfully"
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "An error occurred while adding the note",
            error: err.message
        });
    }
};
