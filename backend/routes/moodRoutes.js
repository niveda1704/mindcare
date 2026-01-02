const express = require('express');
const { logMood, getMoodLogs } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/log', protect, logMood);
router.get('/logs', protect, getMoodLogs);

module.exports = router;
