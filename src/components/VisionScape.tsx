import React, { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
    { name: "Normal Vision", blur: 0, spots: 0, opacity: 1, desc: "Perfectly clear vision with no obstructions." },
    { name: "Mild NPDR", blur: 1, spots: 2, opacity: 0.95, desc: "Slight occasional blurring, minor swelling of retinal vessels." },
    { name: "Moderate NPDR", blur: 3, spots: 8, opacity: 0.85, desc: "Noticeable cloudiness and small red 'floaters' appearing." },
    { name: "Severe NPDR", blur: 6, spots: 20, opacity: 0.7, desc: "Significant obstruction, blocked retinal blood vessels." },
    { name: "Proliferative DR", blur: 12, spots: 45, opacity: 0.4, desc: "Severe vision loss with large dark spots and extreme blurring." }
];

const VisionScape: React.FC = () => {
    const [index, setIndex] = useState(0);
    const current = stages[index];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Eye className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Vision Scape: Stage Simulator</h3>
                </div>
                <p className="text-sm text-gray-500">Slide to see how Diabetic Retinopathy affects sight over time.</p>
            </div>

            <div className="p-8">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-slate-900 shadow-2xl ring-1 ring-gray-200">
                    {/* The "Real World" View (Background) */}
                    <img
                        src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1200"
                        alt="Scenery"
                        className="w-full h-full object-cover transition-all duration-700 brightness-110"
                        style={{ filter: `blur(${current.blur}px)` }}
                    />

                    {/* The Vision Impairment Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full relative"
                            >
                                {/* Simulated dark spots (hemorrhages/scotoma) */}
                                {[...Array(current.spots)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full bg-black/40 blur-[4px]"
                                        style={{
                                            width: `${Math.random() * 40 + 20}px`,
                                            height: `${Math.random() * 30 + 15}px`,
                                            top: `${Math.random() * 90}%`,
                                            left: `${Math.random() * 90}%`,
                                            transform: `rotate(${Math.random() * 360}deg)`,
                                            opacity: 0.6 + (index * 0.1)
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Labels */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{current.name}</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="relative px-2">
                        <input
                            type="range"
                            min="0"
                            max="4"
                            value={index}
                            onChange={(e) => setIndex(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-medical-accent"
                        />
                        <div className="flex justify-between mt-4">
                            {stages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`text-[10px] font-bold uppercase tracking-tighter transition-all ${index === i ? 'text-medical-accent scale-110' : 'text-gray-300'}`}
                                >
                                    Stage {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-6 bg-slate-50 rounded-2xl border border-gray-100 flex gap-4"
                        >
                            <div className="p-2 h-fit bg-white rounded-lg text-gray-400">
                                <Info className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{current.name} Experience</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{current.desc}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-6 bg-amber-50 border-t border-amber-100">
                <div className="flex gap-3">
                    <EyeOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        This simulation is a simplified representation of vision loss. DR symptoms vary greatly between individuals. Early treatment can prevent these obstructions from appearing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VisionScape;
