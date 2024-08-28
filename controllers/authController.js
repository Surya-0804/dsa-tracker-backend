import { hashPassword, comparePassword, validateEmail, toTitleCase } from "../helpers/authHelper.js";
import User from "../models/users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userStreak from "../models/userStreak.js";

export const loginController = async (req, res) => {
    try {
        const { email, password, isGoogleUser } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Fields must not be empty" });
        }

        let user;
        if (isGoogleUser) {
            user = await User.findOne({ googleUid: password, isGoogleUser: true });
        } else {
            user = await User.findOne({ email: email, isGoogleUser: false });
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: '5h' });

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // Months are zero-based

        // Find or create the user's login record
        let userStreakRecord = await userStreak.findOne({ userId: user._id });

        if (!userStreakRecord) {
            userStreakRecord = new userStreak({
                userId: user._id,
                years: [{
                    year,
                    months: [{
                        month,
                        year,
                        logins: [{
                            date: new Date(now.setHours(0, 0, 0, 0)),
                            count: 1
                        }]
                    }]
                }]
            });
        } else {
            // Initialize years and months if they don't exist
            userStreakRecord.years = userStreakRecord.years || [];
            let yearRecord = userStreakRecord.years.find(y => y.year === year);
            if (!yearRecord) {
                yearRecord = { year, months: [] };
                userStreakRecord.years.push(yearRecord);
            }

            yearRecord.months = yearRecord.months || [];
            let monthRecord = yearRecord.months.find(m => m.month === month);
            if (!monthRecord) {
                monthRecord = { month, year, logins: [] };
                yearRecord.months.push(monthRecord);
            }

            monthRecord.logins = monthRecord.logins || [];
            let dailyLogin = monthRecord.logins.find(l => l.date.toDateString() === new Date(now.setHours(0, 0, 0, 0)).toDateString());
            if (dailyLogin) {
                dailyLogin.count += 1;
            } else {
                monthRecord.logins.push({
                    date: new Date(now.setHours(0, 0, 0, 0)),
                    count: 1
                });
            }
        }

        await userStreakRecord.save();

        return res.json({ token, user: { _id: user._id, name: user.name, email: user.email, photoUrl: user.photoUrl } });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error logging in" });
    }
};

// Register Controller
export const registerController = async (req, res) => {
    const { name, email, password, phoneNo, isGoogleUser, photoUrl } = req.body;
    let error = {};

    try {
        if (!name || !email || !password) {
            error = {
                ...error,
                name: "Field must not be empty",
                email: "Field must not be empty",
                password: "Field must not be empty",
                phoneNo: "Field must not be empty"
            };
            console.log("Field must not")
            return res.status(400).json({ error });
        }

        if (name.length < 3 || name.length > 25) {
            error = { ...error, name: "Name must be 3-25 characters" };
            return res.status(400).json({ error });
        }

        if (!validateEmail(email)) {
            error = { ...error, email: "Email is not valid" };
            return res.status(400).json({ error });
        }

        if (password.length < 8) {
            error = { ...error, password: "Password must be 8-255 characters" };
            return res.status(400).json({ error });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            error = { ...error, email: "Email already exists" };
            return res.status(400).json({ error });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (isGoogleUser) {
            const newUser = new User({ name: toTitleCase(name), email, password: hashedPassword, photoUrl, googleUid: uid, isGoogleUser: true });
            await newUser.save();
        }
        else {
            const newUser = new User({ name: toTitleCase(name), email, password: hashedPassword, phoneNo, isGoogleUser: false });
            await newUser.save();
        }

        return res.json({ success: "Account created successfully. Please login" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in Registration" });
    }
}

// Test Controller
export const testController = async (req, res) => {
    try {
        return res.status(200).send("Protected Routes");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error in accessing protected route" });
    }
}
