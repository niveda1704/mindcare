const Mood = require('../models/Mood');
const User = require('../models/User');

exports.logMood = async (req, res) => {
    try {
        const { emoji, label, note } = req.body;
        const mood = await Mood.create({
            userId: req.user._id,
            emoji,
            label,
            note
        });

        // Update streak
        const user = await User.findById(req.user._id);
        const today = new Date().toISOString().split('T')[0];
        const lastCheckIn = user.lastCheckIn ? user.lastCheckIn.toISOString().split('T')[0] : null;

        if (lastCheckIn !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastCheckIn === yesterdayStr) {
                user.streak += 1;
            } else {
                user.streak = 1;
            }
            user.lastCheckIn = new Date();
            await user.save();
        }

        res.status(201).json({ mood, streak: user.streak });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMoodLogs = async (req, res) => {
    try {
        const logs = await Mood.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
