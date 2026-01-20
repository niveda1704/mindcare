const User = require('../models/User');
const CrisisAlert = require('../models/CrisisAlert');
const ScreeningResult = require('../models/ScreeningResult');
const Booking = require('../models/Booking');
const Mood = require('../models/Mood');
const ChatLog = require('../models/ChatLog');

// @desc Get analytics dashboard data (Admin only)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        const overviewData = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            activeAlerts: await CrisisAlert.countDocuments({ status: 'pending' }),
            totalBookings: await Booking.countDocuments(),
            totalCounselors: await User.countDocuments({ role: 'counselor' })
        };

        // Screening Results Distribution (Anonymized)
        const screeningTrends = await ScreeningResult.aggregate([
            {
                $group: {
                    _id: { type: "$type", riskLevel: "$riskLevel" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id.type",
                    riskLevel: "$_id.riskLevel",
                    count: 1
                }
            }
        ]);

        // Emergency Alert History (Last 10 - Anonymized)
        const recentAlerts = await CrisisAlert.find()
            .populate('userId', 'anonymousId name email')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('severity status detectedKeywords createdAt');

        const stats = {
            overview: overviewData,
            screeningTrends,
            recentAlerts
        };

        res.json(stats);
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all students
// @route GET /api/admin/students
const getAllStudents = async (req, res) => {
    try {
        let filter = { role: 'student' };

        // Counselor Restriction: Only show students with appointments with me
        if (req.user.role === 'counselor') {
            const myBookings = await Booking.find({ counselorId: req.user._id }).select('studentId');
            const studentIds = myBookings.map(b => b.studentId);
            filter._id = { $in: studentIds };
        }

        const students = await User.find(filter).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get specific student screenings
// @route GET /api/admin/students/:id/screenings
const getStudentScreenings = async (req, res) => {
    try {
        const results = await ScreeningResult.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get specific student moods
// @route GET /api/admin/students/:id/moods
const getStudentMoods = async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get specific student chat logs
// @route GET /api/admin/students/:id/chatlogs
const getStudentChatLogs = async (req, res) => {
    try {
        const logs = await ChatLog.find({ userId: req.params.id }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getAllStudents, getStudentScreenings, getStudentMoods, getStudentChatLogs };
