const { analyzeTriage } = require('../services/geminiService');
const { logEvent } = require('../services/wandbService');

const handleTriage = async (req, res) => {
    try {
        const { symptoms, duration, severity, age, history } = req.body;

        // Call AI Reasoning
        const aiResult = await analyzeTriage({ symptoms, duration, severity, age, history });

        // Log to simulated W&B
        logEvent({
            inputType: 'triage_request',
            symptomLength: symptoms.length,
            reportedSeverity: severity,
            aiRiskLevel: aiResult.riskLevel,
            aiReasoningLength: aiResult.reasoning.length,
            success: true
        });

        // Return structured response
        res.json({
            success: true,
            data: aiResult,
            source: 'Gemini-Pro'
        });

    } catch (error) {
        console.error('Triage Controller Error:', error);

        // Fallback response
        res.status(500).json({
            success: false,
            error: 'Triage assessment failed. Please consult a doctor directly.'
        });
    }
};

module.exports = { handleTriage };
