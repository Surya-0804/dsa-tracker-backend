import problemsProgress from "../models/problemsProgress.js";
import dsaTracker from "../models/problemSchema.js";

export const completeUserStats = async (req, res) => {
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
            console.log(userProblems)
            await userProblems.save();
        }

        const totalProblems = 450;
        const totalFavourites = userProblems.favourites.length;
        let totalNotes = 0;
        let totalSolutions = 0;
        const totalProblemsSolved = userProblems.solvedProblems.length;
        const totalProblemsForRevision = userProblems.revisionProblems.length;

        userProblems.notes.forEach(noteArray => {
            totalNotes += noteArray.length;
        });

        userProblems.solutions.forEach(solutionArray => {
            totalSolutions += solutionArray.length;
        });

        const stats = {
            totalProblems,
            totalFavourites,
            totalNotes,
            totalSolutions,
            totalProblemsSolved,
            totalProblemsForRevision,
            bookmarks: userProblems.bookmarks,
            favourites: userProblems.favourites,
            notes: Array.from(userProblems.notes),
            solutions: Array.from(userProblems.solutions),
            solvedProblems: userProblems.solvedProblems,
            revisionProblems: userProblems.revisionProblems,
        };
        console.log(stats)
        return res.status(200).json({ stats });
    } catch (error) {
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