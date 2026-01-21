const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { getAiResponse } = require('../utils/geminiAi');

router.get('/', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        backend: 'connected',
        database: dbStatus,
        timestamp: new Date()
    });
});

router.get('/daily-quote', async (req, res) => {
    try {
        // Diverse prompts for variety
        const themes = [
            "short poem about hope and sunrise",
            "philosophical thought about inner strength",
            "gentle reminder to breathe and be present",
            "metaphor about growth and nature"
        ];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const prompt = `Generate a unique, beautiful, and ${randomTheme} for a student's mental wellbeing. Max 25 words. deeply touching and poetic. Do not use quotes.`;
        const quote = await getAiResponse(prompt);
        res.json({ quote });
    } catch (error) {
        // Fallback quotes
        const quotes = [
            "Even in the quietest morning, the sanctuary remains alive and fresh.",
            "You are permitted to simply exist.",
            "Your worth is inherent, like the sky.",
            "Breathe in the calm, breathe out the noise."
        ];
        res.json({ quote: quotes[Math.floor(Math.random() * quotes.length)] });
    }
});

module.exports = router;
