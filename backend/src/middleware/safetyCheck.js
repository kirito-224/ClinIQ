/**
 * Simple rule-based safety engine to catch obvious emergencies.
 * This runs BEFORE the AI model to ensure immediate feedback for critical cases.
 */

const CRITICAL_KEYWORDS = [
    'chest pain', 'heart attack', 'stroke', 'unconscious', 'not breathing',
    'severe bleeding', 'suicide', 'overdose', 'blue lips', 'seizure'
];

const safetyCheck = (req, res, next) => {
    const { symptoms, age, history } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: 'Symptoms are required' });
    }

    const lowerSymptoms = symptoms.toLowerCase();

    // Rule 1: Immediate Critical Keyword Match
    const criticalMatch = CRITICAL_KEYWORDS.find(keyword => lowerSymptoms.includes(keyword));

    if (criticalMatch) {
        console.log(`[SAFETY BLOCK] Critical keyword detected: ${criticalMatch}`);
        return res.json({
            riskLevel: 'HIGH',
            confidence: 1.0,
            reasoning: `IMMEDIATE MEDICAL ATTENTION REQUIRED. Detected critical keyword: "${criticalMatch}". This is a safety override based on keyword detection.`,
            action: 'Call Emergency Services (911) immediately.',
            isSafe: false, // Flag indicating this didn't go to AI
            source: 'Rule-Engine'
        });
    }

    next();
};

module.exports = safetyCheck;
