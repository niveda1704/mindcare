const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_KEY_HERE");

const getAiResponse = async (userMessage, customSystemInstruction = null) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Generating AI Response for:", userMessage);

        // Only try real AI if we have a key and it doesn't look like a placeholder
        if (apiKey && apiKey.length > 20 && !apiKey.includes('YOUR_KEY')) {
            const defaultInstruction = "You are MindCare Guide, a supportive and empathetic mental health assistant for college students. Your goal is to provide a safe, anonymous space for students to talk. Be warm, non-judgmental, and practical. Keep responses concise, conversational, and focused on student wellbeing. Ask gentle follow-up questions to keep the user engaged, just like a supportive friend.";

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: customSystemInstruction || defaultInstruction
            });

            try {
                const result = await model.generateContent(userMessage);
                const response = await result.response;
                const text = response.text();
                // Ensure text is not empty
                if (!text || text.trim().length === 0) throw new Error("Empty AI Response");
                return text;
            } catch (geminiError) {
                console.error("Gemini API Verification Error:", geminiError);
                throw geminiError; // Propagate to catch block below
            }
        }

        // No key or invalid key -> Offline
        console.warn("Gemini API Key missing or invalid. Using Offline mode.");
        return generateOfflineResponse(userMessage);

    } catch (error) {
        console.error("Gemini Error (Falling back to Offline Guide):", error.message);
        return generateOfflineResponse(userMessage);
    }
};

// Advanced Offline Conversational Engine
const generateOfflineResponse = (msg) => {
    const text = msg.toLowerCase();

    // 1. Check for immediate crisis/harm (Safety First)
    if (text.match(/die|kill|suicide|hurt myself|end it all|no reason to live/)) {
        return "I am hearing a lot of pain in your words, and I want you to be safe. You are not alone. Please, can you reach out to a professional right now? The crisis helpline is available 24/7. Your life matters to us.";
    }

    // 2. Greetings & Openers
    if (text.match(/^(hi|hello|hey|greetings|hola)/)) {
        const openers = [
            "Hello. I'm here and listening. How is your day going?",
            "Hi there. It's a safe space here. What's on your mind?",
            "Welcome. I'm glad you're here. How are you feeling right now?"
        ];
        return openers[Math.floor(Math.random() * openers.length)];
    }

    // 3. Emotional Reflection (The "Eliza" Effect)
    if (text.match(/i feel|i am feeling|feeling/)) {
        if (text.includes("sad") || text.includes("depressed") || text.includes("down")) {
            return "It sounds like you're carrying a heavy weight. I'm here to walk with you through it. Do you want to talk about what triggered these feelings?";
        }
        if (text.includes("anxious") || text.includes("nervous") || text.includes("scared")) {
            return "Anxiety can feel like a storm. Let's find some shelter. Have you tried taking a slow, deep breath with me? Tell me, what is the biggest worry on your mind right now?";
        }
        if (text.includes("angry") || text.includes("mad") || text.includes("furious")) {
            return "It's okay to let that anger out here. It's often a sign that a boundary was crossed. What made you feel this way?";
        }
        if (text.includes("happy") || text.includes("great") || text.includes("good")) {
            return "That is wonderful to hear! Holding onto these moments of light is so important. What was the best part of your experience?";
        }
        if (text.includes("lonely") || text.includes("alone")) {
            return "Loneliness is a profound feeling, but you are connected here. I am listening to every word. How long have you been feeling this disconnection?";
        }
    }

    // 4. Topic Specific Responses
    if (text.includes("school") || text.includes("exam") || text.includes("grade") || text.includes("study")) {
        return "Academic pressure is real and valid. Remember, your worth is not defined by a grade. Are you feeling overwhelmed by the workload, or is it the expectations?";
    }
    if (text.includes("sleep") || text.includes("tired") || text.includes("insomnia")) {
        return "Rest is difficult when the mind is racing. Have you been able to find any quiet moments before bed, or does the noise follow you there?";
    }
    if (text.includes("relationship") || text.includes("friend") || text.includes("boyfriend") || text.includes("girlfriend") || text.includes("breakup")) {
        return "Relationships are our deepest mirrors. It sounds like this connection is weighing on you. Do you feel understood by them?";
    }

    // 5. Generalized Follow-up (Keep conversation flowing)
    const followUps = [
        "I'm listening. Please, tell me more about that.",
        "That sounds significant. How does that sit with you?",
        "I hear you. What do you think would help you feel a little lighter right now?",
        "Thank you for sharing that with me. It takes courage to be open. What else is on your mind?",
        "I am processing your words. It seems like this matters a lot to you. Can you elaborate?"
    ];

    return followUps[Math.floor(Math.random() * followUps.length)];
};

const getWellnessResponse = async (userMessage) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && apiKey.length > 20 && !apiKey.includes('YOUR_KEY')) {
            const systemInstruction = `You are a supportive mental health companion.
                Analyze the user's message and provide:
                1. A compassionate, conversational response (approx 2 sentences).
                2. A category for resource recommendation from this list: ['Anxiety', 'Stress', 'Sleep', 'Academic', 'Social', 'Meditation']. If unclear, use 'General'.
                
                Respond ONLY in strict JSON format:
                {
                    "response": "Your response text here...",
                    "category": "The category here"
                }
             `;

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: systemInstruction,
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(userMessage);
            const response = await result.response;
            const text = response.text();
            try {
                return JSON.parse(text);
            } catch (jsonError) {
                console.warn("JSON Parse failed, falling back to text", text);
                return { response: text, category: "General" };
            }
        }

        throw new Error("Offline or No Key");

    } catch (error) {
        // Fallback
        const text = generateOfflineResponse(userMessage);
        let category = 'General';
        const lower = userMessage.toLowerCase();
        if (lower.includes('sleep') || lower.includes('tired')) category = 'Sleep';
        else if (lower.includes('exam') || lower.includes('study') || lower.includes('fail')) category = 'Academic';
        else if (lower.includes('anx') || lower.includes('worry') || lower.includes('nervous')) category = 'Anxiety';
        else if (lower.includes('sad') || lower.includes('depress') || lower.includes('cry')) category = 'Anxiety';
        else if (lower.includes('stress') || lower.includes('overwhelm')) category = 'Stress';

        return { response: text, category };
    }
};

module.exports = { getAiResponse, getWellnessResponse };
