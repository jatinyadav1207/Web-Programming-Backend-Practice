import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

export async function createPost(req, res) {
    const { name, description, age } = req.body ?? {};
    if (!name || !description || age == null) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const post = await Post.create({ name, description, age });
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Provide a name, a description and an age from 1 to 150" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getPosts(req, res) {
    try {
        res.status(200).json(await Post.find());
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updatePost(req, res) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    const { name, description, age } = req.body ?? {};
    const fields = Object.fromEntries(
        Object.entries({ name, description, age }).filter(([, value]) => value !== undefined)
    );
    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: "No data provided for update" });
    }

    try {
        const post = await Post.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post Updated Successfully", post });
    } catch (error) {
        if (["ValidationError", "CastError"].includes(error.name)) {
            return res.status(400).json({ message: "Provide valid post fields and an age from 1 to 150" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deletePost(req, res) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({ message: "Invalid post ID" });
    }

    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post successfully deleted" });
    } catch {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
