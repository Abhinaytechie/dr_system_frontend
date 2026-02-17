import React from 'react';
import ImageUpload from '../components/ImageUpload';
import MeshBackground from '../components/MeshBackground';
import Chatbot from '../components/Chatbot';
const Detection: React.FC = () => {
    const [predictionResult, setPredictionResult] = React.useState<any | null>(null);

    // This page is now strictly for clinicians
    // Patients are routed to /analyze in the Navbar

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
            <MeshBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Retinal Screening</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload a fundus image for instant AI assessment.
                        Ensure the image is clear and centered for the best results.
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 border border-white/50">
                    <ImageUpload onResult={setPredictionResult} result={predictionResult} />
                </div>
            </div>
            <Chatbot context={predictionResult} />
        </div>
    );
};

export default Detection;
