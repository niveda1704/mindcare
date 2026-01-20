const express = require('express');
const { updateAvailability, getAvailability, createSessionNote, getSessionNotes } = require('../controllers/counselorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/availability')
    .get(protect, restrictTo('counselor', 'admin'), getAvailability)
    .post(protect, restrictTo('counselor', 'admin'), updateAvailability);

router.route('/notes')
    .post(protect, restrictTo('counselor', 'admin'), createSessionNote);

router.route('/notes/:studentId')
    .get(protect, restrictTo('counselor', 'admin'), getSessionNotes);

module.exports = router;
