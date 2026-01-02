const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    riskLevel: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },
}, { timestamps: true });

module.exports = mongoose.model('ChatLog', chatLogSchema);
