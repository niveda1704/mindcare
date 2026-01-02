const express = require('express');
const { analyzeMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/analyze', protect, analyzeMessage);

module.exports = router;
