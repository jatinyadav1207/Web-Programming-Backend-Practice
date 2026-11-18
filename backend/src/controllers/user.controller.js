import { User } from "../models/user.model.js";

export async function registerUser(req, res) {
    const { username, email, password } = req.body ?? {};
    if (typeof username !== "string" || !username.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password ||
        Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ message: "Provide a username, email and password of at most 72 UTF-8 bytes" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ message: "user already exists!" });
        }

        const user = await User.create({ username, email: normalizedEmail, password });
        res.status(201).json({
            message: "User registered!",
            user: { id: user.id, email: user.email, username: user.username }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Username must be 1–30 characters and password 6–50 characters" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || !password ||
        Buffer.byteLength(password, "utf8") > 72) {
        return res.status(400).json({ message: "Provide an email and password of at most 72 UTF-8 bytes" });
    }

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            message: "User Logged in",
            user: { id: user.id, email: user.email, username: user.username }
        });
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function logoutuser(req, res) {
    const { email } = req.body ?? {};
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Logout successful" });
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
