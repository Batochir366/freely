"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteToAdmin = exports.loginUser = exports.getUserById = exports.getCurrentUser = exports.getUsers = exports.createUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const createUser = async (req, res) => {
    try {
        const { email, password, userName, firstName, lastName, photo } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "email and password are required" })
                .end();
        }
        try {
            const oldUser = await user_1.default.find({ email: email });
            if (oldUser.length > 0) {
                return res
                    .status(405)
                    .send({ success: false, message: "user already exist" })
                    .end();
            }
            const user = await user_1.default.create({
                email,
                password,
                userName,
                firstName,
                lastName,
                photo,
                isAdmin: true,
            });
            return res
                .status(200)
                .send({
                success: true,
                user: user,
            })
                .end();
        }
        catch (error) {
            console.error(error, "err");
            return res
                .status(400)
                .send({
                success: false,
                message: error,
            })
                .end();
        }
    }
    catch (error) {
        console.error(error, "err");
        return res
            .status(400)
            .send({
            success: false,
            message: error,
        })
            .end();
    }
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const users = await user_1.default.find({})
            .select("-password")
            .sort({ createdAt: -1 });
        return res
            .status(200)
            .send({
            success: true,
            users: users,
        })
            .end();
    }
    catch (error) {
        console.error(error, "err");
        return res
            .status(400)
            .send({
            success: false,
            message: error,
        })
            .end();
    }
};
exports.getUsers = getUsers;
const getCurrentUser = async (req, res) => {
    try {
        const user = await user_1.default.findOne().select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "No users found" });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("getCurrentUser error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });
        }
        const user = await user_1.default.findById(userId).select("-password");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error("getUserById error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getUserById = getUserById;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Email and password are required" });
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({
            success: true,
            user: userResponse,
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("loginUser error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.loginUser = loginUser;
const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(200).json({
            success: true,
            user: userResponse,
            message: "User promoted to admin successfully",
        });
    }
    catch (error) {
        console.error("promoteToAdmin error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.promoteToAdmin = promoteToAdmin;
