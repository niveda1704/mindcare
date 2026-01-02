const mongoose = require('mongoose');
const OTP = require('./models/OTP');
const User = require('./models/User');
require('dotenv').config();

const getOTP = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'nivedasree1704@gmail.com' });
        if (user) {
            const otpRecord = await OTP.findOne({ userId: user._id });
            if (otpRecord) {
                console.log(`\n\n✅ OTP for ${user.email} is: [ ${otpRecord.otp} ]\n\n`);
            } else {
                console.log("No OTP found for this user. Maybe it expired?");
            }
        } else {
            console.log("User not found.");
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getOTP();
