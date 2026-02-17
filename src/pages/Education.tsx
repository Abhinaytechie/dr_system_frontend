import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye, Activity, Shield, AlertCircle, HelpCircle } from 'lucide-react';
import MeshBackground from '../components/MeshBackground';
import Chatbot from '../components/Chatbot';
import Timeline from '../components/Timeline';
import { useAuth } from '../contexts/AuthContext';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

import VisionScape from '../components/VisionScape';

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, icon, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
            <button
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                onClick={onClick}
            >
                <div className="flex items-center space-x-4">
                    {icon && <div className="text-medical-accent">{icon}</div>}
                    <span className="text-lg font-bold text-gray-800">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-6 border-t border-gray-100 text-gray-600 leading-relaxed bg-white overflow-hidden">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

import { useLocation } from 'react-router-dom';

const Education: React.FC = () => {
    const { markTopicViewed } = useAuth();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const location = useLocation();

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('simulate') === 'true') {
            setOpenIndex(2); // Index of VisionScape accordion
            setTimeout(() => {
                const element = document.getElementById('vision-simulation-item');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [location]);

    const toggleAccordion = (index: number) => {
        const isOpening = openIndex !== index;
        setOpenIndex(isOpening ? index : null);

        // Mark as viewed if opening
        if (isOpening) {
            const titles = [
                "What is Diabetic Retinopathy?",
                "Stages of Progression",
                "Experience the Impact: Vision Simulation",
                "Symptoms & Early Signs",
                "Prevention & Care",
                "Frequently Asked Questions"
            ];
            markTopicViewed(titles[index]);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] pb-20">
            <MeshBackground />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Patient Knowledge Hub</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Essential information about Diabetic Retinopathy, simplified for your understanding.
                    </p>
                </div>

                <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <AccordionItem
                        title="What is Diabetic Retinopathy?"
                        icon={<Eye className="w-6 h-6" />}
                        isOpen={openIndex === 0}
                        onClick={() => toggleAccordion(0)}
                    >
                        <p>
                            Diabetic Retinopathy (DR) is a complication of diabetes that affects the eyes. It is caused by damage to the blood vessels of the light-sensitive tissue at the back of the eye (retina).
                        </p>
                        <p className="mt-4">
                            At first, DR may cause no symptoms or only mild vision problems. However, if left untreated, it can lead to blindness. It is the leading cause of new cases of blindness in adults aged 20–74.
                        </p>
                    </AccordionItem>

                    <AccordionItem
                        title="Stages of Progression"
                        icon={<Activity className="w-6 h-6" />}
                        isOpen={openIndex === 1}
                        onClick={() => toggleAccordion(1)}
                    >
                        <div className="py-4">
                            <Timeline />
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        title="Experience the Impact: Vision Simulation"
                        icon={<Eye className="w-6 h-6 text-medical-accent" />}
                        isOpen={openIndex === 2}
                        onClick={() => toggleAccordion(2)}
                    >
                        <div id="vision-simulation-item" className="py-2">
                            <VisionScape />
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        title="Symptoms & Early Signs"
                        icon={<AlertCircle className="w-6 h-6" />}
                        isOpen={openIndex === 3}
                        onClick={() => toggleAccordion(3)}
                    >
                        <p className="mb-4 font-medium">Early stages often have NO symptoms. As it progresses, you may notice:</p>
                        <ul className="grid sm:grid-cols-2 gap-3 list-disc pl-5">
                            <li>Spots or dark strings floating in vision (floaters)</li>
                            <li>Blurred or fluctuating vision</li>
                            <li>Impaired color vision</li>
                            <li>Dark or empty areas in your vision</li>
                            <li>Difficulty seeing at night</li>
                            <li>Sudden vision loss (medical emergency)</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem
                        title="Prevention & Care"
                        icon={<Shield className="w-6 h-6" />}
                        isOpen={openIndex === 4}
                        onClick={() => toggleAccordion(4)}
                    >
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-gray-800 mb-2">Control the ABCs</h4>
                                <ul className="text-sm space-y-1">
                                    <li><strong>A1C:</strong> Keep blood sugar in target range.</li>
                                    <li><strong>Blood Pressure:</strong> High BP damages vessels.</li>
                                    <li><strong>Cholesterol:</strong> Manage levels with diet/meds.</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-gray-800 mb-2">Lifestyle Habits</h4>
                                <ul className="text-sm space-y-1">
                                    <li>Stop smoking immediately.</li>
                                    <li>Exercise regularly (30 mins/day).</li>
                                    <li>Eat a balanced, eye-healthy diet.</li>
                                </ul>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        title="Frequently Asked Questions"
                        icon={<HelpCircle className="w-6 h-6" />}
                        isOpen={openIndex === 5}
                        onClick={() => toggleAccordion(5)}
                    >
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-800">Is Diabetic Retinopathy reversible?</h4>
                                <p className="text-sm mt-1">Damage from advanced stages is often permanent, but treatment can stop it from getting worse. Early control of blood sugar can sometimes reverse mild vessel changes.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">How often should I get screened?</h4>
                                <p className="text-sm mt-1">If you have diabetes (type 1 or type 2), you should have a comprehensive dilated eye exam <strong>at least once a year</strong>.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">Does the screening tool hurt?</h4>
                                <p className="text-sm mt-1">Our AI screening tool is completely non-invasive and painless. It only requires a clear photo of your retina to provide an immediate assessment.</p>
                            </div>
                        </div>
                    </AccordionItem>
                </div>
            </div>

            <Chatbot />
        </div>
    );
};

export default Education;
