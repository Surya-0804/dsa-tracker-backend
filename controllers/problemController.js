import dsaTracker from "../models/problemSchema.js";
import users from '../models/users.js';

export const getQuestionsByTopicsController = async (req, res) => {
    try {
        const { topics } = req.body;
        const result = {};

        for (const topic of topics) {
            const questions = await dsaTracker.find({ Topic: topic });


            result[topic] = questions.map(question => ({
                _id: question._id,
                Topic: question.Topic,
                Problem: question.Problem,
                Difficulty: question.Difficulty,
                Done: question.Done,
                URL: question.URL,
            }));
        }
        return res.status(200).send({
            result,
            success: false,
            message: "Why this was getting wrong"
        })

    } catch (err) {
        console.error("Error fetching questions by topics:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userdsaProgress = async (req, res) => {
    try {
        const userStatus = userStatus.find({ userid: userid });
        userStatus.updateOne({
            problem
        })
        return res.status(200).send({
            questions,
            success: true,
        })
    }
    catch (err) {
        return res.status(300).send({
            success: false,
            message: "Why this was getting wrong"
        })
    }
}

