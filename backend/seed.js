const mongoose = require('mongoose');
const User = require('./models/User');
const Resource = require('./models/Resource');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding");

        // 1. Seed Counselors
        // 1. Seed Counselors
        await User.deleteMany({ role: 'counselor' });
        console.log("Cleared existing counselors");
        const counselors = [
            { email: 'nirmaladevi@mindcare.edu', password: 'password123', role: 'counselor', college: 'Central University', anonymousId: 'Nirmaladevi' },
            { email: 'aruna@mindcare.edu', password: 'password123', role: 'counselor', college: 'Technical Institute', anonymousId: 'Aruna' },
            { email: 'anitha@mindcare.edu', password: 'password123', role: 'counselor', college: 'Arts & Science College', anonymousId: 'Anitha' },
            { email: 'rakesh@mindcare.edu', password: 'password123', role: 'counselor', college: 'Medical College', anonymousId: 'Rakesh' }
        ];

        for (const c of counselors) {
            const exists = await User.findOne({ email: c.email });
            if (!exists) {
                const salt = await bcrypt.genSalt(10);
                c.password = await bcrypt.hash(c.password, salt);
                c.isVerified = true;
                await User.create(c);
                console.log(`Created counselor: ${c.email}`);
            }
        }

        // 2. Seed Resources
        const resources = [
            // Videos
            {
                title: "Understanding Anxiety: What Happens in Your Brain?",
                category: "Anxiety",
                type: "video",
                url: "https://www.youtube.com/embed/FUZ5M5u_2m0", // Placeholder educational video embed
                description: "A 5-minute guide to the neuroscience of anxiety and how to manage it.",
                thumbnail: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "10 Minute Mindfulness Meditation",
                category: "Mindfulness",
                type: "video",
                url: "https://www.youtube.com/embed/ZToicYcHIOU",
                description: "A guided session to help you center your thoughts and reduce stress quickly.",
                thumbnail: "https://images.unsplash.com/photo-1544367563-12123d815d19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "Coping with Academic Pressure",
                category: "Stress",
                type: "video",
                url: "https://www.youtube.com/embed/K8lg14Q14",
                description: "Expert tips on handling exam stress and maintaining work-life balance in college.",
                thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "Signs of Depression You Shouldn't Ignore",
                category: "Depression",
                type: "video",
                url: "https://www.youtube.com/embed/Do4p4eM1",
                description: "Learn to recognize the early warning signs of depression in yourself and others.",
                thumbnail: "https://images.unsplash.com/photo-1613318265671-1188178b61c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            // Articles
            {
                title: "A Student's Guide to Better Sleep",
                category: "Sleep",
                type: "article",
                url: "https://www.sleepfoundation.org/teens-and-sleep",
                description: "Why sleep matters for your grades and mental health, and how to get more of it.",
                thumbnail: "https://images.unsplash.com/photo-1511295742362-e1c97a8c8808?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "How to Deal with Panic Attacks",
                category: "Anxiety",
                type: "article",
                url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/panic-attacks/",
                description: "Practical steps to take when you feel a panic attack coming on.",
                thumbnail: "https://images.unsplash.com/photo-1588611910609-0d368e7343e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "Journaling for Mental Clarity",
                category: "Self-Care",
                type: "article",
                url: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1",
                description: "How writing down your thoughts can track symptoms and improve your mood.",
                thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                title: "Building Resilience in Tough Times",
                category: "Growth",
                type: "article",
                url: "https://www.apa.org/topics/resilience",
                description: "Strategies to bounce back from failure and challenges in your academic journey.",
                thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            }
        ];

        console.log("Removing existing resources to prevent duplicates...");
        await Resource.deleteMany({}); // Optional: clear old resources

        await Resource.insertMany(resources);
        console.log(`Successfully added ${resources.length} resources to the Hub.`);

        console.log("Seeding completed");
        process.exit();
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

seedData();
