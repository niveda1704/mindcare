const analyzeRisk = (message) => {
    const categories = {
        high: [
            'suicide', 'kill myself', 'end my life', 'want to die',
            'hang myself', 'cut myself', 'overdose', 'end it all', 'better off dead',
            'don\'t want to live', 'no reason to live', 'everyone would be better without me',
            'wish i was dead', 'wish i hadn\'t been born', 'want to sleep forever',
            'make it stop', 'can\'t go on', 'goodbye forever'
        ],
        medium: [
            'depressed', 'anxious', 'hopeless', 'lonely', 'sad',
            'can\'t take it anymore', 'tired of life', 'worthless', 'giving up'
        ],
        anxiety: [
            'anxiety', 'panic', 'heart racing', 'scared', 'worried', 'nervous', 'trembling'
        ],
        loneliness: [
            'lonely', 'alone', 'no one to talk to', 'isolated', 'left out'
        ],
        sleep: [
            'sleep', 'insomnia', 'nightmare', 'can\'t sleep', 'staying up'
        ],
        academic: [
            'exam', 'grades', 'study', 'college', 'professor', 'fail', 'pressure', 'assignment'
        ],
        gratitude: [
            'thank', 'thanks', 'grateful', 'appreciate', 'helpful'
        ],
        greeting: [
            'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'
        ]
    };

    const lowerMessage = message.toLowerCase();

    // High risk takes priority
    const detectedHigh = categories.high.filter(keyword => lowerMessage.includes(keyword));
    if (detectedHigh.length > 0) {
        return { level: 'high', type: 'crisis', keywords: detectedHigh };
    }

    // Check other categories
    for (const [type, keywords] of Object.entries(categories)) {
        if (type === 'high') continue;
        const matching = keywords.filter(keyword => lowerMessage.includes(keyword));
        if (matching.length > 0) {
            return { level: type === 'medium' ? 'medium' : 'low', type, keywords: matching };
        }
    }

    return { level: 'none', type: 'general', keywords: [] };
};

module.exports = { analyzeRisk };

