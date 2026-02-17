import React, { useState } from 'react';
import MeshBackground from '../components/MeshBackground';
import Chatbot from '../components/Chatbot';
import { BookOpen, ExternalLink, Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import EyeCareFacilities from '../components/EyeCareFacilities';
import ReportUploader from '../components/ReportUploader';

const AnalyzeReport: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
            <MeshBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                {/* Intro Section */}
                {!analysisResult && (
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
                            <Info className="w-4 h-4" />
                            AI-Powered Medical Review
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Understand Your <span className="text-indigo-600">Eye Health</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Upload your clinical reports to receive a simplified AI explanation and gain clarity on your status.
                        </p>
                    </div>
                )}

                <ReportUploader onAnalysisComplete={setAnalysisResult} />

                <div className="mt-20 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-sm">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Patient Resources</h2>
                        <p className="text-gray-500">Essential tools and information for your journey</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3 text-indigo-600">
                                <BookOpen className="w-5 h-5" />
                                <h3 className="font-bold">Knowledge Hub</h3>
                            </div>
                            <p className="text-sm text-gray-500">Learn about the stages of diabetic retinopathy and how to protect your vision.</p>
                            <Link to="/education" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 hover:underline">
                                Explore Topics <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3 text-indigo-600">
                                <Activity className="w-5 h-5" />
                                <h3 className="font-bold">Nearby Care</h3>
                            </div>
                            <p className="text-sm text-gray-500">If you have symptoms or are diabetic, find a specialized eye care facility near you.</p>
                            <a href="#nearby-care" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 hover:underline">
                                Find a Clinic <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div id="nearby-care" className="pt-10 border-t border-gray-100">
                        <EyeCareFacilities />
                    </div>
                </div>
            </div>

            <Chatbot context={analysisResult} />
        </div>
    );
};

export default AnalyzeReport;
