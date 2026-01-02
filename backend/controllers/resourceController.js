const Resource = require('../models/Resource');

const getResources = async (req, res) => {
    try {
        let resources = await Resource.find();

        // Fallback Mock Data if DB is empty (for demo purposes)
        if (resources.length === 0) {
            resources = [
                { _id: '1', title: '5 Minute Anxiety Relief', description: 'A quick grounding exercise.', type: 'video', category: 'Anxiety', url: 'https://www.youtube.com/embed/O-6f5wQXSu8' },
                { _id: '2', title: 'Understanding Burnout', description: 'Signs and how to cope.', type: 'article', category: 'Stress', url: 'https://www.healthline.com/health/burnout' },
                { _id: '3', title: 'Sleep Hygiene Basics', description: 'Tips for better rest.', type: 'article', category: 'Sleep', url: 'https://www.sleepfoundation.org/sleep-hygiene' },
            ];
        }

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createResource = async (req, res) => {
    // Admin only
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getResources, createResource };
