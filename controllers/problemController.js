import dsaTracker from "../models/problemSchema.js";
import users from '../models/users.js';


export const getAllProblemsController = async (req, res) => {
    try {
        const results = await dsaTracker.find({});

        const groupedQuestions = {};

        // Iterate through each document and organize by topic
        results.forEach(({ _id, Topic, Problem, Difficulty, URL }) => {
            if (!groupedQuestions[Topic]) {
                groupedQuestions[Topic] = [];
            }
            groupedQuestions[Topic].push({ _id, Problem, Difficulty, URL });
        });

        return res.status(200).send({
            success: true,
            data: groupedQuestions,
            message: "Questions grouped by topics"
        });

    } catch (err) {
        console.error("Error fetching questions by topics:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const bookmarkController = async (req, res) => {
    try {

    }
    catch (err) {
        console.error("Error :", err);
        res.status(500).json({ error: "Internal Server Error" });

    }
}
