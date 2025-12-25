import React from 'react';
import { TriageResponse } from '../lib/api';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface RiskResultProps {
    result: TriageResponse['data'];
}

export default function RiskResult({ result }: RiskResultProps) {
    if (!result) return null;

    const getColors = (level: string) => {
        switch (level?.toUpperCase()) {
            case 'HIGH': return 'bg-red-50 text-red-700 border-red-200';
            case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'LOW': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const colors = getColors(result.riskLevel);

    return (
        <div className={`mt-6 p-6 rounded-lg border ${colors} shadow-md transition-all animate-fade-in`}>
            <h3 className="text-xl font-bold flex items-center gap-2">
                {result.riskLevel === 'High' && <AlertCircle className="w-6 h-6" />}
                {result.riskLevel === 'Low' && <CheckCircle className="w-6 h-6" />}
                Risk Assessment: {result.riskLevel}
            </h3>

            <div className="mt-4 space-y-3">
                <div>
                    <span className="font-semibold block uppercase text-xs tracking-wider opacity-75">Reasoning</span>
                    <p className="text-lg leading-relaxed">{result.reasoning}</p>
                </div>

                <div className="bg-white bg-opacity-40 p-3 rounded">
                    <span className="font-semibold block uppercase text-xs tracking-wider opacity-75">Recommended Action</span>
                    <p className="font-medium">{result.recommendedAction || result.action}</p>
                </div>
            </div>

            <div className="mt-4 text-xs opacity-60 text-right">
                Analysis Source: {result.source || 'AI System'}
            </div>
        </div>
    );
}
