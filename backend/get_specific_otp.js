const mongoose = require('mongoose');
const OTP = require('./models/OTP');
const User = require('./models/User');
require('dotenv').config();

const getUserOTP = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'nivedasree1704@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            const otpRecord = await OTP.findOne({ userId: user._id });
            if (otpRecord) {
                console.log(`\n\n🔎 FOUND OTP for ${email}:\n-----------------------------\nOTP:   [ ${otpRecord.otp} ]\n-----------------------------\n`);
            } else {
                console.log(`User found (${email}), but no OTP record exists. It might have expired.`);
            }
        } else {
            console.log(`User ${email} NOT found in database.`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getUserOTP();
