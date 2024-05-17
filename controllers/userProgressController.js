import usersOverallProgress from "../models/usersOverallProgress";
import userProgress from "../models/userProgress";

export const addNewUserController = async (userid) => {
    try {
        // Insert the new user record
        await usersOverallProgress.create({ userid });
    } catch (err) {
        console.error("Error inserting new user:", err);
        // throw err;
    }
};