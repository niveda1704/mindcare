// Model to store psychological screening results for a student
// Supports PHQ-9, GAD-7, GHQ questionnaires

const mongoose = require('mongoose');

const screeningResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['PHQ-9', 'GAD-7', 'GHQ'], required: true },
    answers: [{ question: Number, answer: Number }], // numeric answers (0-3 typical)
    score: { type: Number, required: true },
    riskLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScreeningResult', screeningResultSchema);
