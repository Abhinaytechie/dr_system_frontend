import React from 'react';
import MeshBackground from '../components/MeshBackground';
import Chatbot from '../components/Chatbot';
import { AlertTriangle, ShieldCheck, FileText, Lock } from 'lucide-react';

const Disclaimer: React.FC = () => {
    return (
        <div className="relative min-h-[calc(100vh-64px)]">
            <MeshBackground />

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Important Disclaimer</h1>
                    <p className="text-lg text-gray-600">Please read the following information carefully before using this service.</p>
                </div>

                <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                    {/* Medical Warning */}
                    <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
                        <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                            <h2 className="text-lg font-bold text-orange-800">For Educational Purposes Only</h2>
                        </div>
                        <div className="p-6 text-gray-700 leading-relaxed">
                            <p className="mb-4">
                                This Diabetic Retinopathy screening tool uses Artificial Intelligence to analyze retinal fundus images.
                                <strong> It is NOT a medical device and does NOT provide a medical diagnosis.</strong>
                            </p>
                            <p>
                                The results provided by this system are for <strong>educational and informational use only</strong>.
                                Even if the result indicates "No DR," this does not guarantee good eye health.
                            </p>
                        </div>
                    </div>

                    {/* Professional Advice */}
                    <div className="bg-white rounded-xl shadow-sm border border-teal-100 overflow-hidden">
                        <div className="bg-teal-50 p-4 border-b border-teal-100 flex items-center space-x-3">
                            <ShieldCheck className="w-6 h-6 text-medical-accent" />
                            <h2 className="text-lg font-bold text-teal-900">Consult a Professional</h2>
                        </div>
                        <div className="p-6 text-gray-700 leading-relaxed">
                            <p>
                                You should never rely on this tool as a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or qualified ophthalmologist with any questions you may have regarding a medical condition.
                            </p>
                            <p className="mt-4 font-medium text-medical-accent">
                                If you experience sudden vision loss, pain, or flashes of light, seek emergency medical attention immediately.
                            </p>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center space-x-3">
                            <Lock className="w-6 h-6 text-gray-600" />
                            <h2 className="text-lg font-bold text-gray-800">Data Privacy</h2>
                        </div>
                        <div className="p-6 text-gray-700 leading-relaxed">
                            <p>
                                We prioritize your privacy. The images you upload are processed in real-time for analysis and are
                                <strong> NOT permanently stored</strong> on our servers. The AI analysis happens temporarily during your session.
                            </p>
                        </div>
                    </div>

                    {/* Agreement */}
                    <div className="text-center mt-12 text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <FileText className="w-4 h-4" />
                            <span>Terms of Use</span>
                        </div>
                        <p>By using this website, you acknowledge and agree to these disclaimers.</p>
                    </div>

                </div>
            </div>
            <Chatbot />
        </div>
    );
};

export default Disclaimer;
