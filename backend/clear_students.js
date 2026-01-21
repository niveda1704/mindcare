const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const clearStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Delete only students
        const result = await User.deleteMany({ role: 'student' });

        console.log(`Deleted ${result.deletedCount} existing student accounts.`);
        console.log('Admin and Counselor accounts (if any) are preserved.');

        const remaining = await User.find({});
        console.log('Remaining Users:', remaining.map(u => ({ email: u.email, role: u.role })));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearStudents();
