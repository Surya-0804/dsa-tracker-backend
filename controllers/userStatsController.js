import problemsProgress from "../models/problemsProgress.js";
import userScores from '../models/userScores.js'
import dsaTracker from "../models/problemSchema.js";


export const completeUserStats = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let userProblems = await problemsProgress.findOne({ userId });
        console.log("sdfjsdif :", userProblems);

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

        const totalProblems = 450;
        const totalFavourites = userProblems.favourites ? userProblems.favourites.length : 0;
        let totalNotes = 0;
        let totalSolutions = 0;
        const totalProblemsSolved = userProblems.solvedProblems ? userProblems.solvedProblems.length : 0;
        const totalProblemsForRevision = userProblems.revisionProblems ? userProblems.revisionProblems.length : 0;

        if (userProblems.notes) {
            userProblems.notes.forEach(noteArray => {
                totalNotes += noteArray.length;
            });
        }

        if (userProblems.solutions) {
            userProblems.solutions.forEach(solutionArray => {
                totalSolutions += solutionArray.length;
            });
        }

        const stats = {
            totalProblems,
            totalFavourites,
            totalNotes,
            totalSolutions,
            totalProblemsSolved,
            totalProblemsForRevision,
            bookmarks: userProblems.bookmarks || [],
            favourites: userProblems.favourites || [],
            notes: Array.from(userProblems.notes ? userProblems.notes.entries() : []),
            solutions: Array.from(userProblems.solutions ? userProblems.solutions.entries() : []),
            solvedProblems: userProblems.solvedProblems || [],
            revisionProblems: userProblems.revisionProblems || [],
        };

        return res.status(200).json({ stats });
    } catch (error) {
        console.error("Error in completeUserStats:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const completeUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await problemsProgress.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const leaderBoardStats = async (req, res) => {
    try {
        const leaderboardStats = await userScores.findOne({});
        return res.status(200).json({ leaderboardStats })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

export const topicWiseStats = async (req, res) => {
    try {
        const { userId } = req.body;

        let userProblems = await problemsProgress.findOne({ userId });
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

        const solvedProblems = userProblems.solvedProblems;

        const topicWiseCount = {};
        const easyProblems = [];
        const mediumProblems = [];
        const hardProblems = [];

        for (const problemData of solvedProblems) {
            const problem = await dsaTracker.findOne({ _id: problemData.value });
            if (problem) {
                const problemInfo = {
                    id: problem._id,
                    title: problem.Problem,
                    timestamp: problemData.timestamp
                };

                if (topicWiseCount[problem.Topic]) {
                    topicWiseCount[problem.Topic]++;
                } else {
                    topicWiseCount[problem.Topic] = 1;
                }

                if (problem.Difficulty === 'Easy') {
                    easyProblems.push(problemInfo);
                } else if (problem.Difficulty === 'Medium') {
                    mediumProblems.push(problemInfo);
                } else if (problem.Difficulty === 'Hard') {
                    hardProblems.push(problemInfo);
                }
            }
        }

        const stats = {
            topicWiseCount,
            problemsByDifficulty: {
                Easy: easyProblems,
                Medium: mediumProblems,
                Hard: hardProblems,
            }
        };

        return res.status(200).json({ stats });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const leetCodeStats = async (req, res) => {
    try {
        const { userName } = req.body;

        // Execute the Python script with the username as an argument
        exec(`python3 ../scraping/leetcode.py ${userName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ success: false, error: 'Error executing Python script' });
            }
            try {
                // Read and parse the output from the Python script (if stored in a JSON file)
                fs.readFile('GFG_stats.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading JSON file:', err);
                        return res.status(500).json({ success: false, error: 'Error reading JSON file' });
                    }
                    const jsonData = JSON.parse(data);
                    console.log(jsonData);
                    res.json(jsonData);
                });
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return res.status(500).json({ success: false, error: 'Error parsing JSON' });
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const gfgStats = async (req, res) => {
    try {
        const { userName } = req.body;

        // Execute the Python script with the username as an argument
        exec(`python3 ../scraping/gfg.py ${userName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ success: false, error: 'Error executing Python script' });
            }
            try {
                // Read and parse the output from the Python script (if stored in a JSON file)
                fs.readFile('GFG_stats.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading JSON file:', err);
                        return res.status(500).json({ success: false, error: 'Error reading JSON file' });
                    }
                    const jsonData = JSON.parse(data);
                    console.log(jsonData);
                    res.json(jsonData);
                });
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).json({ success: false, error: 'Error parsing JSON' });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};