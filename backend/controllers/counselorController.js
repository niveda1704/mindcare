const User = require('../models/User');
const SessionNote = require('../models/SessionNote');

// @desc    Update Counselor Availability
// @route   POST /api/counselor/availability
const updateAvailability = async (req, res) => {
    const { availability } = req.body; // Expects [{ day: 'Monday', slots: ['10:00', '11:00'] }]
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'counselor' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        user.availability = availability;
        await user.save();
        res.json({ message: 'Availability updated', availability: user.availability });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get Counselor Availability
// @route   GET /api/counselor/availability
const getAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.availability || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create Session Note
// @route   POST /api/counselor/notes
const createSessionNote = async (req, res) => {
    const { studentId, note, tags } = req.body;
    try {
        const newNote = await SessionNote.create({
            studentId,
            counselorId: req.user.id,
            note,
            tags
        });
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get Session Notes for a Student
// @route   GET /api/counselor/notes/:studentId
const getSessionNotes = async (req, res) => {
    try {
        const notes = await SessionNote.find({ studentId: req.params.studentId })
            .populate('counselorId', 'name email')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { updateAvailability, getAvailability, createSessionNote, getSessionNotes };
