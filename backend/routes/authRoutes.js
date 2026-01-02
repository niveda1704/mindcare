const express = require('express');
const { registerUser, loginUser, verifyOtp, getCounselors } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOtp);
router.get('/counselors', getCounselors);

module.exports = router;
