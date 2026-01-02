const express = require('express');
const { bookAppointment, getAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/', protect, getAppointments);

module.exports = router;
