const express = require('express');
const { getDashboardStats, getAllStudents, getStudentScreenings, getStudentMoods, getStudentChatLogs } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, restrictTo('admin'), getDashboardStats);
router.get('/students', protect, restrictTo('admin', 'counselor'), getAllStudents);
router.get('/students/:id/screenings', protect, restrictTo('admin', 'counselor'), getStudentScreenings);
router.get('/students/:id/moods', protect, restrictTo('admin', 'counselor'), getStudentMoods);
router.get('/students/:id/chatlogs', protect, restrictTo('admin', 'counselor'), getStudentChatLogs);

module.exports = router;
