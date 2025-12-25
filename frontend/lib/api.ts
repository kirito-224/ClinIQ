export interface TriageData {
    symptoms: string;
    duration: string;
    severity: number;
    age: number;
    history?: string;
}

export interface TriageResponse {
    success: boolean;
    data?: {
        riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
        reasoning: string;
        recommendedAction: string;
        source?: string;
        action?: string; // from safety check
        isSafe?: boolean;
    };
    error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const analyzeSymptoms = async (data: TriageData): Promise<TriageResponse> => {
    try {
        const res = await fetch(`${API_URL}/api/triage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return await res.json();
    } catch (error) {
        console.error('API Call Failed', error);
        return { success: false, error: 'Network error. Is the backend running?' };
    }
};
