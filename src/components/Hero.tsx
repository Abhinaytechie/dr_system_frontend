import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    return (
        <div className="relative pt-10 pb-20 sm:pt-16 sm:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-medical-accent animate-pulse"></span>
                            <span className="text-xs font-bold text-medical-accent uppercase tracking-wider">Clinical AI Analysis Active</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-6xl font-extrabold text-medical-text tracking-tight mb-6 leading-[1.1]"
                        >
                            Next-Generation <br />
                            <span className="text-medical-accent font-black">Retinal Screening</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 mb-10 leading-relaxed lg:pr-10"
                        >
                            Empowering healthcare providers and patients with high-precision Deep Learning for early detection of Diabetic Retinopathy.
                            Professional assessment through CNN-Transformer hybrid intelligence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link
                                to="/detect"
                                className="px-8 py-4 bg-medical-accent text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all transform hover:-translate-y-1 text-center"
                            >
                                Launch Screening Portal
                            </Link>
                            <Link
                                to="/education"
                                className="px-8 py-4 bg-white text-medical-text font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all text-center"
                            >
                                Clinical Education
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-5 flex justify-center items-center"
                    >
                        <div className="relative w-full rounded-3xl shadow-2xl overflow-hidden aspect-[4/3] border-4 border-white transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <video
                                src="https://ik.imagekit.io/sv5x3c7qr/vecteezy_detailed-macro-extreme-close-up-view-of-a-human-blue-green_75928200.mov"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <p className="text-white text-xs font-medium tracking-wide">
                                    "Early detection prevents over 95% of vision loss cases in diabetic adults."
                                </p>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-200/20 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
