import React from 'react';
import MeshBackground from '../components/MeshBackground';
import Hero from '../components/Hero';
import Chatbot from '../components/Chatbot';
import EyeCareFacilities from '../components/EyeCareFacilities';
import VisionTeaser from '../components/VisionTeaser';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Shield, Cpu, Users, ArrowRight, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { userRole, currentUser } = useAuth();
    const stats = [
        { label: "Diabetic Adults", value: "1 in 3", detail: "Over age 40 have some form of DR" },
        { label: "Vision Loss", value: "95%", detail: "Preventable with early detection" },
        { label: "Analysis Time", value: "< 2s", detail: "Instant clinical-grade assessment" },
        { label: "Architecture", value: "Hybrid", detail: "CNN-Transformer Intelligence" }
    ];
    // ... rest of component

    const allFeatures = [
        {
            icon: <Activity className="w-6 h-6" />,
            title: "Precision Screening",
            desc: "Advanced neural networks trained on clinical datasets for high-fidelity detection of microaneurysms and exudates.",
            role: 'clinician'
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Early Awareness",
            desc: "Understand how diabetic retinopathy affects vision and why early screening is the best way to prevent vision loss.",
            role: 'patient'
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Hybrid Intelligence",
            desc: "Combining EfficientNet feature extraction with Transformer sequence modeling for superior spatial relationship analysis.",
            role: 'clinician'
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Self Education",
            desc: "Learn about the stages of DR, from non-proliferative to proliferative, and how lifestyle affects eye health.",
            role: 'patient'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Data Privacy",
            desc: "Local-first processing priorities and encrypted data handling ensure patient confidentiality and security compliant standards.",
            role: 'both'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Local Care",
            desc: "Quickly locate specialized eye care facilities and retina centers near you for professional medical consultations.",
            role: 'patient'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Inclusive Access",
            desc: "Bridging the gap in specialist availability by providing primary care physicians with powerful initial screening tools.",
            role: 'clinician'
        }
    ];

    const features = allFeatures.filter(f => f.role === userRole || f.role === 'both');

    return (
        <div className="pb-20 min-h-[calc(100vh-64px)] relative bg-slate-50">
            <MeshBackground />

            <div className="relative z-10">
                {/* Hero Section */}
                <Hero />

                {/* Clinician Call to Action */}
                {userRole === 'clinician' && currentUser && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-medical-accent rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
                        >
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Ready to screen a patient?</h3>
                                <p className="text-teal-50/80">Access high-precision analysis tools and Grad-CAM visualization.</p>
                            </div>
                            <Link
                                to="/detect"
                                className="bg-white text-medical-accent px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-50 transition-colors shrink-0"
                            >
                                Start Deep Screening
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                )}

                {/* Stats Section */}
                {userRole === 'clinician' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white flex flex-col items-center text-center"
                                >
                                    <span className="text-2xl font-black text-medical-accent mb-1">{stat.value}</span>
                                    <span className="text-sm font-bold text-medical-text mb-2 uppercase tracking-tighter">{stat.label}</span>
                                    <p className="text-xs text-gray-500 leading-tight">{stat.detail}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Core Values / Features */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-medical-text mb-4">
                            {userRole === 'patient' ? "Your Vision, Our Priority" : "Advancing Ophthalmic Diagnostics"}
                        </h2>
                        <div className="w-20 h-1 bg-medical-accent mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-teal-50 text-medical-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-medical-accent group-hover:text-white transition-colors duration-500">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-medical-text mb-3">{f.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Interactive Vision Simulation Teaser - Priority for Patients */}
                {userRole === 'patient' && (
                    <div className="mb-20">
                        <VisionTeaser />
                    </div>
                )}

                {/* Eye Care Facilities Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <EyeCareFacilities />
                </div>
            </div>

            <Chatbot />
        </div>
    );
};

export default Home;
