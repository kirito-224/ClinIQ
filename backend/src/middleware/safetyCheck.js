/**
 * Simple rule-based safety engine to catch obvious emergencies.
 * Runs BEFORE the AI model to ensure immediate feedback for critical cases.
 */

const CRITICAL_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'unconscious',
  'not breathing',
  'severe bleeding',
  'suicide',
  'overdose',
  'blue lips',
  'seizure',
];

function isSevereForElderly(severity, age) {
  if (typeof severity !== 'number' || typeof age !== 'number') return false;
  return severity >= 9 && age >= 65;
}

const safetyCheck = (req, res, next) => {
  const { symptoms, severity, age } = req.body || {};

  if (!symptoms || typeof symptoms !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Symptoms are required and must be a string.',
    });
  }

  const lowerSymptoms = symptoms.toLowerCase();

  // Rule 1: Immediate critical keyword match
  const criticalMatch = CRITICAL_KEYWORDS.find((keyword) =>
    lowerSymptoms.includes(keyword)
  );

  // Rule 2: Very high severity in elderly patients
  const elderlySevere = isSevereForElderly(severity, age);

  if (criticalMatch || elderlySevere) {
    const reasonParts = [];
    if (criticalMatch) {
      reasonParts.push(`Detected critical symptom keyword: "${criticalMatch}".`);
    }
    if (elderlySevere) {
      reasonParts.push(
        'Reported very high severity in an older patient (possible emergency risk).'
      );
    }

    return res.json({
      success: true,
      data: {
        riskLevel: 'High',
        reasoning:
          'IMMEDIATE MEDICAL ATTENTION REQUIRED. ' + reasonParts.join(' '),
        recommendedAction: 'Call emergency services (911) immediately.',
        source: 'Rule-Engine',
        action: 'Call emergency services (911) immediately.',
        isSafe: false,
      },
    });
  }

  // If not caught by safety rules, continue to AI triage
  next();
};

module.exports = safetyCheck;
