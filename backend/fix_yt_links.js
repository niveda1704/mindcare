const mongoose = require('mongoose');
const Resource = require('./models/Resource');
require('dotenv').config();

const fixLinks = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mindcare');
        console.log('Connected to MongoDB');

        const resources = await Resource.find({ type: 'video' });

        let count = 0;
        for (const r of resources) {
            // If it is an embed link, convert to watch link for better direct opening
            // e.g. https://www.youtube.com/embed/dQw4w9WgXcQ -> https://www.youtube.com/watch?v=dQw4w9WgXcQ
            if (r.url.includes('/embed/')) {
                const newUrl = r.url.replace('/embed/', '/watch?v=');
                r.url = newUrl;
                await r.save();
                count++;
                console.log(`Updated: ${r.title} -> ${newUrl}`);
            }
        }

        console.log(`Fix Complete. Updated ${count} video links.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixLinks();
