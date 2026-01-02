const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be assigned later or selected
    counsellorName: { type: String }, // For easier display if needed
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
