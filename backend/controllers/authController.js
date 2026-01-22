// Comprehensive Auth Controller supporting role‑based login, OTP verification, and email notifications
// ---------------------------------------------------------------
// Dependencies
const User = require('../models/User');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ---------------------------------------------------------------
// Helpers
// Generate JWT token for a user ID
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Validate that an email belongs to an official college domain (e.g., .edu, .ac.in, .ac.uk)
const isCollegeEmail = (email) => /@([a-zA-Z0-9_-]+\.)?(edu|ac\.in|ac\.uk|ac|edu\.in)$/i.test(email);

// ---------------------------------------------------------------
// @desc    Register a new user (student, counselor, admin)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role = 'student', rollNumber, college } = req.body;
    try {
        // Check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Enforce student‑specific constraints
        if (role === 'student') {
            if (!isCollegeEmail(email)) {
                return res.status(400).json({ message: 'Student must use official college email' });
            }
            if (!rollNumber) {
                return res.status(400).json({ message: 'Roll number required for students' });
            }
        }

        // Create user (password will be hashed via pre‑save hook)
        const anonymousId = `Anon-${Math.floor(1000 + Math.random() * 9000)}`;
        const user = await User.create({ name, email, password, role, rollNumber, college, parentEmail: req.body.parentEmail, anonymousId });

        // Generate OTP for email verification
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ userId: user._id, otp: otpCode });

        console.log(`\n============================\n[DEV MODE] Registration OTP for ${user.email}: ${otpCode}\n============================\n`);

        // Send verification email
        await sendEmail(
            user.email,
            'MindCare - Verify Your Account',
            `Your verification code is: ${otpCode}`,
            `<h3>Welcome to MindCare 💗</h3><p>Your verification code is: <strong>${otpCode}</strong></p>`
        );

        res.status(201).json({
            message: 'User registered. Verify email OTP.',
            userId: user._id,
            email: user.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ---------------------------------------------------------------
// @desc    Verify OTP (used for registration and login)
// @route   POST /api/auth/verify-otp
// body: { email, otp, purpose: 'register' | 'login' }
const verifyOtp = async (req, res) => {
    const { email, otp, purpose } = req.body;
    console.log(`[DEBUG] Verifying OTP for ${email}, Purpose: ${purpose || 'not specified'}`);
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otpRecord = await OTP.findOne({ userId: user._id, otp });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });

        // Mark email as verified
        user.isVerified = true;
        await user.save();
        await OTP.deleteOne({ _id: otpRecord._id });

        // If this OTP was for login, issue JWT and send success email
        if (purpose === 'login' || !purpose) {
            const token = generateToken(user._id);
            console.log(`[SUCCESS] Login verified for ${user.email}`);
            await sendEmail(
                user.email,
                'MindCare - Login Successful',
                'You have successfully logged in.',
                `<p>Login successful. Welcome back, ${user.email}.</p>`
            );
            return res.json({ message: 'Login successful', token, user: { id: user._id, role: user.role, email: user.email } });
        }

        // Registration flow or other – just confirm verification
        console.log(`[SUCCESS] Email verified for ${user.email}`);
        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ---------------------------------------------------------------
// @desc    Login user (student, counselor, admin)
// @route   POST /api/auth/login
// body: { email, password, rollNumber (optional for students) }
const loginUser = async (req, res) => {
    const { email, password, rollNumber } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Developer Role Management (Safeguard: Only run if explicitly needed, disabled for production safety)
        // if (email === 'nivedasree1704@gmail.com' && user.role !== 'admin') {
        //     user.role = 'admin';
        //     await user.save();
        // }

        // Verify password (bcrypt hash)
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // STRICT ROLE ENFORCEMENT
        // If the user claims to be an admin or counselor, their email MUST be in the allowed list.
        // You can update these lists as needed.
        const ALLOWED_ADMINS = ['nivedasree1704@gmail.com', 'admin@mindcare.com'];
        const ALLOWED_COUNSELORS = [
            'counselor@mindcare.com',
            'dr.smith@mindcare.com',
            'nirmaladevi@mindcare.edu',
            'aruna@mindcare.edu',
            'anitha@mindcare.edu',
            'rakesh@mindcare.edu'
        ];

        if (user.role === 'admin' && !ALLOWED_ADMINS.includes(email)) {
            return res.status(403).json({ message: 'Access Denied: You are not authorized as an Admin.' });
        }
        if (user.role === 'counselor' && !ALLOWED_COUNSELORS.includes(email)) {
            return res.status(403).json({ message: 'Access Denied: You are not authorized as a Counselor.' });
        }

        // Role‑specific handling
        if (user.role === 'student') {
            // Enforce college email & roll number consistency
            // Enforce college email & roll number consistency
            // if (!isCollegeEmail(email)) {
            //     return res.status(400).json({ message: 'Student must use official college email' });
            // }
            if (rollNumber && rollNumber !== user.rollNumber) {
                return res.status(400).json({ message: 'Roll number mismatch' });
            }

            // SIMPLIFIED LOGIN FLOW (Requested):
            // If user is already verified (from registration or previous login), skip OTP (2FA).
            // Only ask for OTP if account is NOT verified yet.
            if (user.isVerified) {
                const token = generateToken(user._id);
                return res.json({ message: 'Login successful', token, user: { id: user._id, role: user.role, email: user.email } });
            }

            // If NOT verified, generate OTP for verification (First time login / Verification)
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ userId: user._id });
            await OTP.create({ userId: user._id, otp: otpCode });

            console.log(`\n============================\n[LOGIN VERIFICATION] OTP for ${user.email}: ${otpCode}\n============================\n`);

            await sendEmail(
                user.email,
                'MindCare - Verify Your Account',
                `Your verification code is: ${otpCode}`,
                `<h3>MindCare Login 🔐</h3><p>Your verification code is: <strong>${otpCode}</strong></p><p>Please verify your account to proceed.</p>`
            );

            return res.json({ message: 'OTP sent to email', needsVerification: true, email: user.email });
        } else {
            // Counselor / Admin – direct login (no OTP)
            const token = generateToken(user._id);
            await sendEmail(
                user.email,
                'MindCare - Login Successful',
                'You have successfully logged in.',
                `<p>Login successful. Welcome back, ${user.email}.</p>`
            );
            return res.json({ message: 'Login successful', token, user: { id: user._id, role: user.role, email: user.email } });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all counselors
// @route   GET /api/auth/counselors
const getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor' }).select('anonymousId email college');
        res.json(counselors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, verifyOtp, loginUser, getCounselors };
