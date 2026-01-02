
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err.message);
        process.exit(1);
    }
};

const fixIndexes = async () => {
    await connectDB();

    try {
        const Mood = require('./models/Mood');
        console.log('Fetching indexes for moods collection...');
        const indexes = await Mood.collection.indexes();
        console.log('Current Indexes:', indexes);

        // Drop the problematic index
        // The error name usually matches the index name, but safe to drop by key pattern or name if found
        // problematic index: userId_1_date_1

        try {
            await Mood.collection.dropIndex('userId_1_date_1');
            console.log('Successfully dropped index: userId_1_date_1');
        } catch (e) {
            console.log('Index userId_1_date_1 not found or already dropped:', e.message);
        }

        console.log('Indexes cleaned up.');
    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

fixIndexes();
