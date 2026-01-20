const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = '24uam136niveda@kgkite.ac.in';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:');
            console.log({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                // Don't log full password hash, just verify it exists
                passwordHashPrefix: user.password ? user.password.substring(0, 10) + '...' : 'MISSING',
            });
        } else {
            console.log(`User with email ${email} NOT found.`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
