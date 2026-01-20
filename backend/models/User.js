const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    anonymousId: { type: String, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String },
    rollNumber: { type: String },
    role: { type: String, enum: ['student', 'counselor', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastCheckIn: { type: Date },
    // For Counselors
    availability: [{
        day: { type: String }, // e.g., "Monday"
        slots: [{ type: String }] // e.g., ["10:00 AM", "11:00 AM"]
    }]
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
