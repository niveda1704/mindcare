// controllers/appointmentController.js

const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

/**
 * Book a counselling appointment (student only).
 * Expected body: { counselorId, date }
 */
const bookAppointment = async (req, res) => {
    const { counselorId, date } = req.body;
    const studentId = req.user._id;

    if (!counselorId || !date) {
        return res.status(400).json({ message: 'counselorId and date are required' });
    }

    try {
        const booking = await Booking.create({ studentId, counselorId, date });

        // Email confirmation to student
        await sendEmail(
            req.user.email,
            'MindCare - Appointment Confirmed',
            `Your appointment is scheduled for ${date}`,
            `<p>Appointment confirmed for <strong>${date}</strong>.</p>`
        );

        // Email notification to counselor (if counselor exists)
        const counselor = await User.findById(counselorId);
        if (counselor) {
            await sendEmail(
                counselor.email,
                'MindCare - New Appointment',
                `A student has booked a session on ${date}`,
                `<p>New appointment scheduled for ${date}.</p>`
            );
        }

        res.status(201).json({ message: 'Appointment booked', booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get appointments.
 * - Students get only their own bookings.
 * - Counselors get bookings where they are assigned.
 * - Admin gets all bookings.
 */
const getAppointments = async (req, res) => {
    const { role, _id } = req.user;
    let filter = {};
    if (role === 'student') {
        filter = { studentId: _id };
    } else if (role === 'counselor') {
        filter = { counselorId: _id };
    } // admin gets everything

    try {
        const appointments = await Booking.find(filter)
            .populate('studentId', 'email anonymousId name')
            .populate('counselorId', 'email anonymousId name');
        res.json({ appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { bookAppointment, getAppointments };
