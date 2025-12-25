const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || 'MISSING_KEY');

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const analyzeTriage = async (data) => {
    const { symptoms, duration, severity, age, history } = data;

    const prompt = `
    You are a generic clinical triage assistant (ClinIQ). 
    Your goal is to assess the risk level of a patient based on their inputs.
    
    PATIENT DATA:
    - Symptoms: ${symptoms}
    - Duration: ${duration}
    - Self-reported Severity (1-10): ${severity}
    - Age: ${age}
    - Medical History: ${history || 'None'}

    TASKS:
    1. Determine a Risk Level: "Low", "Medium", or "High".
    2. Provide a brief, explainable reasoning (max 2 sentences).
    3. Recommend a general action (e.g., "Home care", "See GP soon", "Go to ER").

    SAFETY RULES:
    - DO NOT diagnose. Use phrases like "Possible signs of..." or "Symptoms suggest...".
    - If unsure, err on the side of caution (higher risk).
    - If the input is nonsense or non-medical, return Risk Level "Unknown".

    OUTPUT FORMAT (JSON ONLY):
    {
      "riskLevel": "Low" | "Medium" | "High" | "Unknown",
      "reasoning": "string",
      "recommendedAction": "string"
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON formatting if Gemini adds markdown blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('AI Reasoning Failed');
    }
};

module.exports = { analyzeTriage };
