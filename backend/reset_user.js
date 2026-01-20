
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = '24uam136niveda@kgkite.ac.in';
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            user.password = 'password123'; // Will be hashed by pre-save
            user.isVerified = true;
            user.rollNumber = '24uam136'; // Ensure roll number matches
            user.role = 'student';
            await user.save();
            console.log('User password reset to "password123" and verified.');
        } else {
            console.log('User not found. Creating new user...');
            user = await User.create({
                email,
                password: 'password123',
                name: 'Niveda Sree',
                role: 'student',
                rollNumber: '24uam136',
                college: 'KG Kite',
                isVerified: true,
                anonymousId: `Anon-${Math.floor(1000 + Math.random() * 9000)}`
            });
            console.log('User created with password "password123".');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetUser();
