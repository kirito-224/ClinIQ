const { analyzeTriage } = require('../services/geminiService');

const handleTriage = async (req, res) => {
  try {
    const { symptoms, duration, severity, age, history } = req.body || {};

    // Basic validation here as a fallback (safetyCheck already validates symptoms)
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Symptoms are required and must be a string.',
      });
    }

    const aiResult = await analyzeTriage({
      symptoms,
      duration,
      severity,
      age,
      history,
    });

    return res.json({
      success: true,
      data: {
        ...aiResult,
        source: aiResult.source || 'Gemini-1.5-Flash',
        isSafe: true,
      },
    });
  } catch (error) {
    console.error('Triage Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Triage assessment failed. Please consult a doctor directly.',
    });
  }
};

module.exports = { handleTriage };
