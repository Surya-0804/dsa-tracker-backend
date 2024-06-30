import { hashPassword, comparePassword, validateEmail, toTitleCase } from "../helpers/authHelper.js";
import userModel from "../models/users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Login Controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        console.log(password)
        if (!email || !password) {
            return res.status(400).json({ error: "Fields must not be empty" });
        }

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        console.log(isMatch)
        const token = jwt.sign({ _id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token)
        console.log("authentication completed successfully")
        return res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error logging in" });
    }
}

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

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            error = { ...error, email: "Email already exists" };
            return res.status(400).json({ error });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (isGoogleUser) {
            const newUser = new userModel({ name: toTitleCase(name), email, password: hashedPassword, photoUrl, googleUid: uid, isGoogleUser: true });
            await newUser.save();
        }
        else {
            const newUser = new userModel({ name: toTitleCase(name), email, password: hashedPassword, phoneNo, isGoogleUser: false });
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
