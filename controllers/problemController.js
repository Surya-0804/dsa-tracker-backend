import dsaTracker from "../models/problemSchema.js";

export const problemFetchingController = async (req, res) => {
    try {
        const questions = await dsaTracker.find();
        return res.status(200).send({
            questions,
            success: true,
        })
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Why this was getting wrong"
        })
    }
};
