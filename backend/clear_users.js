const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const clearUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await User.deleteMany({}); // Clear all users
        console.log("All users cleared. Database is clean.");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearUsers();
