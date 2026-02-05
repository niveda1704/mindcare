const mongoose = require('mongoose');
const Resource = require('./models/Resource');
const dotenv = require('dotenv');
dotenv.config();

const seedRichResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindcare');
        console.log("Connected to MongoDB for Rich Content Seeding");

        // Clear existing resources to ensure we have a clean slate of high-quality content
        await Resource.deleteMany({});
        console.log("Cleared old resources.");

        const richResources = [
            // --- ANXIETY & STRESS ---
            {
                title: "Weightless (Marconi Union) - Most Relaxing Song",
                category: "Anxiety",
                type: "audio",
                url: "https://www.youtube.com/watch?v=UfcAVejslrU",
                description: "Scientifically proven to reduce anxiety by up to 65%. Close your eyes and listen.",
                thumbnail: "https://i.ytimg.com/vi/UfcAVejslrU/hqdefault.jpg"
            },
            {
                title: "10-Minute Meditation for Anxiety",
                category: "Anxiety",
                type: "video",
                url: "https://www.youtube.com/watch?v=O-6f5wQXSu8",
                description: "A gentle guided meditation to ease an anxious mind and find your center.",
                thumbnail: "https://i.ytimg.com/vi/O-6f5wQXSu8/hqdefault.jpg"
            },
            {
                title: "Box Breathing Technique",
                category: "Stress",
                type: "video",
                url: "https://www.youtube.com/watch?v=tEmt1Znux58",
                description: "A powerful, simple naval seal technique to de-escalate stress in minutes.",
                thumbnail: "https://i.ytimg.com/vi/tEmt1Znux58/hqdefault.jpg"
            },
            {
                title: "Why We Get Stressed",
                category: "Stress",
                type: "article",
                url: "https://www.apa.org/topics/stress",
                description: "Understanding the biological roots of stress and how to manage it positively.",
                thumbnail: "https://images.unsplash.com/photo-1541199249251-f716e6136c20?w=1000&q=80"
            },

            // --- SLEEP ---
            {
                title: "Deep Sleep Music: Delta Waves",
                category: "Sleep",
                type: "audio",
                url: "https://www.youtube.com/watch?v=1opH_D0t744",
                description: "Peaceful music with Delta waves to help you drift into deep, restorative sleep.",
                thumbnail: "https://i.ytimg.com/vi/1opH_D0t744/hqdefault.jpg"
            },
            {
                title: "Sleep Hygiene 101",
                category: "Sleep",
                type: "article",
                url: "https://www.sleepfoundation.org/sleep-hygiene",
                description: "Practical tips to build a better bedtime routine for quality rest.",
                thumbnail: "https://images.unsplash.com/photo-1511295742362-e1c97a8c8808?w=1000&q=80"
            },
            {
                title: "Progressive Muscle Relaxation for Sleep",
                category: "Sleep",
                type: "video",
                url: "https://www.youtube.com/watch?v=SNqHGADBJg4",
                description: "Release tension from your body to prepare for a good night's rest.",
                thumbnail: "https://i.ytimg.com/vi/SNqHGADBJg4/hqdefault.jpg"
            },

            // --- ACADEMIC ---
            {
                title: "Study With Me - Lofi Hip Hop",
                category: "Academic",
                type: "audio",
                url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
                description: "Chill beats to relax and study to. Great for focus without distraction.",
                thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg"
            },
            {
                title: "Overcoming Exam Failure",
                category: "Academic",
                type: "video",
                url: "https://www.youtube.com/watch?v=7506c1R3Gq4",
                description: "Uplifting advice on how to bounce back from academic setbacks.",
                thumbnail: "https://i.ytimg.com/vi/7506c1R3Gq4/hqdefault.jpg"
            },
            {
                title: "Pomodoro Technique for Studying",
                category: "Academic",
                type: "article",
                url: "https://todoist.com/productivity-methods/pomodoro-technique",
                description: "A time management method that can revolutionize how you study.",
                thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80"
            },

            // --- DEPRESSION / LOW MOOD ---
            {
                title: "You Are Not Alone - Support Song",
                category: "Depression",
                type: "audio",
                url: "https://www.youtube.com/watch?v=pSFM6W9t_qI",
                description: "A gentle reminder that hope exists even in the darkest moments.",
                thumbnail: "https://i.ytimg.com/vi/pSFM6W9t_qI/hqdefault.jpg"
            },
            {
                title: "Moving Through Depression",
                category: "Depression",
                type: "video",
                url: "https://www.youtube.com/watch?v=8Su5VtKeXU8",
                description: "TED Talk on finding meaning and connection when feeling low.",
                thumbnail: "https://i.ytimg.com/vi/8Su5VtKeXU8/hqdefault.jpg"
            },
            {
                title: "Walking for Mental Health",
                category: "Depression",
                type: "article",
                url: "https://www.health.harvard.edu/mind-and-mood/exercise-is-an-all-natural-treatment-to-fight-depression",
                description: "How simple movement can act as a natural antidepressant.",
                thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1000&q=80"
            },

            // --- SOCIAL / RELATIONSHIPS ---
            {
                title: "How to Make Friends as an Adult",
                category: "Social",
                type: "video",
                url: "https://www.youtube.com/watch?v=I9hJ_RujQD4",
                description: "Practical advice on building connection and overcoming social anxiety.",
                thumbnail: "https://i.ytimg.com/vi/I9hJ_RujQD4/hqdefault.jpg"
            },
            {
                title: "Setting Healthy Boundaries",
                category: "Social",
                type: "article",
                url: "https://psychcentral.com/lib/10-way-to-build-and-preserve-better-boundaries",
                description: "Learn to say 'no' to protect your peace and energy.",
                thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=80"
            },

            // --- MEDITATION / GENERAL WELLNESS ---
            {
                title: "Daily Calm - 10 Minute Meditation",
                category: "Meditation",
                type: "video",
                url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
                description: "A simple daily practice to cultivate mindfulness and presence.",
                thumbnail: "https://i.ytimg.com/vi/ZToicYcHIOU/hqdefault.jpg"
            },
            {
                title: "Morning Yoga for Energy",
                category: "Meditation",
                type: "video",
                url: "https://www.youtube.com/watch?v=VaoV1PrYft4",
                description: "A short yoga flow to wake up your body and mind properly.",
                thumbnail: "https://i.ytimg.com/vi/VaoV1PrYft4/hqdefault.jpg"
            }
        ];

        await Resource.insertMany(richResources);
        console.log(`Successfully seeded ${richResources.length} premium resources.`);

        process.exit(0);
    } catch (error) {
        console.error("Rich Seeding Failed:", error);
        process.exit(1);
    }
};

seedRichResources();
