const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // Anxiety, Stress, etc.
    language: { type: String, default: 'English' },
    type: { type: String, enum: ['audio', 'video', 'article', 'pdf'], required: true },
    url: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
