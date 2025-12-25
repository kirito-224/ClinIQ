import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
    return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium">
                        Medical Disclaimer
                    </p>
                    <p className="text-sm text-amber-600 mt-1">
                        ClinIQ is an AI-assisted triage tool for informational purposes only.
                        <strong> It does NOT diagnose medical conditions.</strong>
                        If you are experiencing a medical emergency, call emergency services immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
