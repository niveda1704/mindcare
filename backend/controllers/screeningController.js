// controllers/screeningController.js

const ScreeningResult = require('../models/ScreeningResult');

/**
 * Compute score and risk level for a given questionnaire type.
 * @param {string} type - 'PHQ-9' | 'GAD-7' | 'GHQ'
 * @param {Array<number>} answers - numeric answers (0‑3 typical)
 * @returns {{score:number, riskLevel:string}}
 */
const compute = (type, answers) => {
    const score = answers.reduce((a, b) => a + b, 0);
    let riskLevel = 'low';
    if (type === 'PHQ-9') {
        if (score >= 15) riskLevel = 'high';
        else if (score >= 5) riskLevel = 'moderate';
    } else if (type === 'GAD-7') {
        if (score >= 15) riskLevel = 'high';
        else if (score >= 5) riskLevel = 'moderate';
    } else if (type === 'GHQ') {
        if (score >= 20) riskLevel = 'high';
        else if (score >= 8) riskLevel = 'moderate';
    }
    return { score, riskLevel };
};

// @desc Submit screening answers
// @route POST /api/screening/:type
const submitScreening = async (req, res) => {
    try {
        const { type } = req.params; // PHQ-9, GAD-7, GHQ
        const { answers } = req.body; // array of numbers

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user._id;
        console.log(`[DEBUG] Submitting ${type} for user ${userId}`);
        console.log('[DEBUG] Answers:', answers);
        console.log('[DEBUG] req.body:', req.body);

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers array required' });
        }

        // Validate all answers are numbers
        if (answers.some(a => a === null || typeof a !== 'number')) {
            return res.status(400).json({ message: 'All questions must be answered' });
        }

        const { score, riskLevel } = compute(type, answers);

        const result = await ScreeningResult.create({
            userId,
            type,
            answers: answers.map((a, i) => ({ question: i + 1, answer: a })),
            score,
            riskLevel,
        });

        console.log(`[SUCCESS] Screening saved for user ${userId}`);
        res.status(201).json({ message: 'Screening saved successfully', result: { score, riskLevel, id: result._id } });
    } catch (error) {
        console.error('Screening Submission Error:', error);
        res.status(500).json({
            message: 'Internal server error saving assessment',
            error: error.message
        });
    }
};

module.exports = { submitScreening };
