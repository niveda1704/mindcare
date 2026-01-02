const ChatLog = require('../models/ChatLog');
const CrisisAlert = require('../models/CrisisAlert');
const { analyzeRisk } = require('../utils/riskDetection');
const { notifyEmergency } = require('../utils/emergencyNotifier');
const { getAiResponse } = require('../utils/geminiAi');

/**
 * Analyze a student's chat message.
 * - Detect risk level using riskDetection utility.
 * - High risk: create CrisisAlert, emit real‑time alert, notify counselor & admin via email, lock chat.
 * - Medium risk: empathetic suggestion to book a counselling session.
 * - Low/none: normal empathetic response (no default greeting).
 */
const analyzeMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const student = req.user;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const { level, type, keywords } = analyzeRisk(message);

        // Save user message to chat log
        await ChatLog.create({
            userId: student._id,
            message,
            sender: 'user',
            riskLevel: level,
        });

        // High risk handling
        if (level === 'high') {
            const alert = await CrisisAlert.create({
                userId: student._id,
                severity: 'high',
                detectedKeywords: keywords,
                triggerMessage: message,
            });

            const io = req.app.get('socketio');
            if (io) {
                io.emit('crisis_alert', {
                    alertId: alert._id,
                    anonymousId: student.anonymousId,
                    severity: 'high',
                    message: `High risk detected: ${keywords.join(', ')}`,
                    timestamp: new Date(),
                });
            }

            await notifyEmergency(alert, student);

            // Generate AI Crisis Response
            const crisisPrompt = "URGENT: The user has expressed intent for self-harm or suicide. You must act as a compassionate, calm, and de-escalating crisis support companion. Your goal is to make them feel heard, validated, and less alone right now. Do not offer medical advice, but do 'hold space' for their pain. Gently remind them that help is available and there is hope, but focus on empathy first. Ask a simple, grounding question to keep them talking to you. Keep it brief and soothing.";

            let aiCrisisMessage;
            try {
                aiCrisisMessage = await getAiResponse(message, crisisPrompt);
            } catch (e) {
                aiCrisisMessage = "I hear how much pain you are in right now, and I want you to know that you are not alone. Please, stay with me. I've alerted a professional who can really help, but I am here to listen. Can you take a breath and tell me what's happening?";
            }

            return res.json({
                level: 'high',
                message: aiCrisisMessage,
                emergencyHelpline: ['+1-800-273-8255', '+91-9152987821'],
            });
        }

        // AI Response using Gemini
        const aiResponse = await getAiResponse(message);

        // Save AI response to log
        await ChatLog.create({
            userId: student._id,
            message: aiResponse,
            sender: 'ai',
            riskLevel: 'low',
        });

        return res.json({
            level: level,
            type: type,
            message: aiResponse,
        });
    } catch (error) {
        console.error("Analyze Message Error:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = { analyzeMessage };
