import userSchema from "../models/users.js";

export const uploadImageController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const imgData = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: req.file.mimetype
        };

        let user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        userSchema.img = imgData;

        await user.save();

        return res.status(200).json({ message: "Image uploaded successfully", user });
    } catch (error) {
        console.error("Error in uploadImageController:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};