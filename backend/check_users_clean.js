const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsersClean = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log('--- USER LIST START ---');
        console.log(`Total Users: ${users.length}`);
        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
        });
        console.log('--- USER LIST END ---');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsersClean();
