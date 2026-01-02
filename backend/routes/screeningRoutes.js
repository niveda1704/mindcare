const express = require('express');
const { submitScreening } = require('../controllers/screeningController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/screening/:type
// @desc    Submit screening answers (PHQ-9, GAD-7, GHQ)
// @access  Private (Student)
router.post('/:type', protect, submitScreening);

module.exports = router;
