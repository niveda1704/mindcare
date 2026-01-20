const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, required: true },
    tags: [{ type: String }], // e.g., 'Anxiety', 'Academic', 'Follow-up'
    isPrivate: { type: Boolean, default: true } // Usually notes are private to counselors
}, { timestamps: true });

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
