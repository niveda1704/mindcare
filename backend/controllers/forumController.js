const ForumPost = require('../models/ForumPost');

// @desc    Create post
// @route   POST /api/forum
const createPost = async (req, res) => {
    const { content } = req.body;
    try {
        const post = await ForumPost.create({
            authorId: req.user._id,
            anonymousId: req.user.anonymousId,
            content
        });
        res.status(201).json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/forum
const getPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find()
            .populate('authorId', 'anonymousId role')
            .sort({ createdAt: -1 });
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getPosts };
