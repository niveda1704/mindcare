const mongoose = require('mongoose');
const OTP = require('./models/OTP');
const User = require('./models/User');
require('dotenv').config();

const getLastOTP = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (user) {
            const otpRecord = await OTP.findOne({ userId: user._id });
            if (otpRecord) {
                console.log(`\n\n🔎 FOUND LATEST OTP:\n-----------------------------\nEMAIL: ${user.email}\nOTP:   [ ${otpRecord.otp} ]\n-----------------------------\n`);
            } else {
                console.log(`User found (${user.email}), but no OTP record exists.`);
            }
        } else {
            console.log("No users found in database yet.");
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getLastOTP();
