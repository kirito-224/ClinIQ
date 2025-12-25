'use client';

import React, { useState } from 'react';
import { analyzeSymptoms, TriageData, TriageResponse } from '../lib/api';
import RiskResult from './RiskResult';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function TriageForm() {
    const [formData, setFormData] = useState<TriageData>({
        symptoms: '',
        duration: '',
        severity: 5,
        age: 30,
        history: ''
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TriageResponse['data'] | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const res = await analyzeSymptoms(formData);

        if (res.success && res.data) {
            setResult(res.data);
        } else {
            setError(res.error || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-8">
                <div className="space-y-6">

                    {/* Symptoms Input */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Main Symptoms</label>
                        <textarea
                            required
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            rows={3}
                            placeholder="e.g., Severe headache on the left side, sensitivity to light..."
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                            <input
                                required
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                                placeholder="e.g., 2 hours"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Age</label>
                            <input
                                required
                                type="number"
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Severity Slider */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Self-Reported Severity (1-10): <span className="text-primary font-bold">{formData.severity}</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            value={formData.severity}
                            onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Mild</span>
                            <span>Severe</span>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Relevant Medical History (Optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                            placeholder="e.g. Asthma, Diabetes"
                            value={formData.history}
                            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                Analyze Risk <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6 border border-red-100">
                    Error: {error}
                </div>
            )}

            <RiskResult result={result!} />
        </div>
    );
}
