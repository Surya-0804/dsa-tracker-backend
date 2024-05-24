import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import path from 'path';
import userModel from "../models/auth/userSchema.js";
import { addNewUserController } from "./userProgressController.js"

export const loginController = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                error: "Fields must not be empty",
            });
        }
        try {
            const data = await userModel.findOne({ email: email });
            if (!data) {
                return res.json({
                    error: "Invalid email or password",
                });
            } else {
                const login = await bcrypt.compare(password, data.password);
                if (login) {
                    const token = jwt.sign(
                        { _id: data._id, role: "user" },
                        process.env.JWT_SECRET
                    );
                    const encode = jwt.verify(token, process.env.JWT_SECRET);
                    return res.json({
                        token: token,
                        user: encode,
                    });
                } else {
                    return res.json({
                        error: "Invalid email or password",
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error to login",
            err
        })
    }
}

export const registerController = async (req, res) => {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    try {
        if (!name || !email || !password || !cPassword) {
            error = {
                ...error,
                name: "Filed must not be empty",
                email: "Filed must not be empty",
                password: "Filed must not be empty",
                cPassword: "Filed must not be empty",
            };
            return res.json({ error });
        }
        if (name.length < 3 || name.length > 25) {
            error = { ...error, name: "Name must be 3-25 charecter" };
            return res.json({ error });
        } else {
            if (validateEmail(email)) {
                name = toTitleCase(name);
                if ((password.length > 255) | (password.length < 8)) {
                    error = {
                        ...error,
                        password: "Password must be 8 charecter",
                        name: "",
                        email: "",
                    };
                    return res.json({ error });
                } else {
                    try {
                        password = bcrypt.hashSync(password, 10);
                        const data = await userModel.findOne({ email: email });
                        if (data) {
                            error = {
                                ...error,
                                password: "",
                                name: "",
                                email: "Email already exists",
                            };
                            return res.json({ error });
                        } else {
                            let newUser = new userModel({
                                name,
                                email,
                                password,
                                userRole: 1,
                            });
                            newUser
                                .save()
                                .then((data) => {
                                    return res.json({
                                        success: "Account create successfully. Please login",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                error = {
                    ...error,
                    password: "",
                    name: "",
                    email: "Email is not valid",
                };
                return res.json({ error });
            }
        }
    }

    catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error in Registration",
            err
        })
    }
}


export const testController = async (req, res) => {
    try {
        return res.status(200).send("Protected Routes")
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Error in Registration",
            err
        })
    }
}
