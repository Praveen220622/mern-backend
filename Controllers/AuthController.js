const UserModel = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Now you can access process.env.JWT_SECRET

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists. Please login.", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const userModel = new UserModel({ name, email, password: hashedPassword });
        await userModel.save();

        res.status(201).json({ message: "Signup successful", success: true });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Email or password is incorrect.", success: false });
        }

        // Compare the password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Email or password is incorrect.", success: false });
        }


        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );


        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = { signup, login };
