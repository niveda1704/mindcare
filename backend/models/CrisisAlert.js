const mongoose = require('mongoose');

const crisisAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    severity: { type: String, default: 'high' },
    status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' },
    detectedKeywords: [{ type: String }],
    triggerMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CrisisAlert', crisisAlertSchema);
