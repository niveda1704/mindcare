const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    anonymousId: { type: String, required: true }, // Display name
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [{
        authorId: { type: mongoose.Schema.Types.ObjectId },
        anonymousId: { type: String },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    isVerifiedAuthor: { type: Boolean, default: false }, // If counsellor posts
    reported: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', forumPostSchema);
