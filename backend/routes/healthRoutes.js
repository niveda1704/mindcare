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
        const prompt = "Generate a short, poetic, and comforting single sentence thought for a student's mental wellbeing. Do not use quotes around it. Just the text.";
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
