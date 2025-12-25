const config = require('../config/env');

// Lazy-load the ESM-only Google Gemini SDK using dynamic import so this works
// in a CommonJS Node.js backend without changing the whole project to ESM.
let modelPromise = null;

async function getGeminiModel() {
    if (!config.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment');
    }

    if (!modelPromise) {
        modelPromise = (async () => {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
            return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        })();
    }

    return modelPromise;
}

function extractJsonFromText(text) {
    if (!text) {
        throw new Error('Empty response from Gemini');
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No JSON object found in Gemini response');
    }

    const jsonStr = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);
}

const analyzeTriage = async (data) => {
    const { symptoms, duration, severity, age, history } = data;

    const prompt = `
You are ClinIQ, a clinical triage assistant.
Your goal is to assess the risk level of a patient based on their inputs.

PATIENT DATA:
- Symptoms: ${symptoms}
- Duration: ${duration}
- Self-reported Severity (1-10): ${severity}
- Age: ${age}
- Medical History: ${history || 'None'}

TASKS:
1. Determine a Risk Level: "Low", "Medium", "High", or "Unknown".
2. Provide a brief, explainable reasoning (max 2 sentences).
3. Recommend a general action (e.g., "Home care", "See GP soon", "Go to ER").

SAFETY RULES:
- DO NOT diagnose. Use phrases like "Possible signs of..." or "Symptoms suggest...".
- If unsure, err on the side of caution (higher risk).
- If the input is nonsense or non-medical, return Risk Level "Unknown".

OUTPUT FORMAT:
Return **ONLY** a single JSON object matching this TypeScript type, with no extra text, comments, or markdown:
{
  "riskLevel": "Low" | "Medium" | "High" | "Unknown",
  "reasoning": string,
  "recommendedAction": string
}
`;

    try {
        const model = await getGeminiModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            return extractJsonFromText(text);
        } catch (parseError) {
            // If direct JSON extraction fails, try a simpler cleanup
            const cleanText = text
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .trim();
            return JSON.parse(cleanText);
        }
    } catch (error) {
        console.error('Gemini API Error Full:', JSON.stringify(error, null, 2));
        console.error('Gemini API Error Message:', error.message);
        throw new Error('AI Reasoning Failed');
    }
};

module.exports = { analyzeTriage };
