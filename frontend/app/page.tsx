import Disclaimer from '@/components/Disclaimer';
import TriageForm from '@/components/TriageForm';
import { Activity } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-primary selection:text-white">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
                            <Activity className="text-white w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">ClinIQ</h1>
                    </div>
                    <p className="text-slate-500 text-lg">Clinical Intelligence for Smarter Triage</p>
                </div>

                {/* Safety Disclaimer */}
                <div className="max-w-2xl mx-auto">
                    <Disclaimer />
                </div>

                {/* Main Interface */}
                <TriageForm />

                {/* Footer */}
                <footer className="text-center text-slate-400 text-sm mt-12 py-6 border-t border-slate-200">
                    <p>© 2025 ClinIQ Health Systems. For demonstration purposes only.</p>
                </footer>
            </div>
        </main>
    );
}
