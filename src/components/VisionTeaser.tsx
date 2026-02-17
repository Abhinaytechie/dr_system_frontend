import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';

const VisionTeaser: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Smooth motion values
    const mX = useMotionValue(0);
    const mY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 200 };
    const lensX = useSpring(mX, springConfig);
    const lensY = useSpring(mY, springConfig);

    const [isHovering, setIsHovering] = useState(false);

    // Initial positioning in center
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mX.set(rect.width / 2);
            mY.set(rect.height / 2);
        }
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Clamp values within boundaries to prevent focus from leaving the box
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        mX.set(x);
        mY.set(y);
    };

    // Correct way to animate composite strings in Framer Motion
    const clipPathValue = useMotionTemplate`circle(100px at ${lensX}px ${lensY}px)`;

    return (
        <section className="py-24 relative overflow-hidden bg-slate-900 rounded-[3rem] mx-4 sm:mx-8 lg:mx-12 my-20 border border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div className="relative z-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-8"
                    >
                        <Eye className="w-4 h-4" />
                        Professional Perspective
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-extrabold mb-8 leading-[1.1]"
                    >
                        Experience the <br />
                        <span className="text-teal-400 italic">Power of Early Detection</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 mb-10 leading-relaxed"
                    >
                        Move your mouse over the retinal scan to simulate how our AI clarifies vision by identifying hidden markers. Diabetic Retinopathy is silent until it's not.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            to="/education?simulate=true"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-400 transition-all duration-300 shadow-lg shadow-teal-500/20"
                        >
                            Open Vision Simulator
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Interactive Lens Area */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-none group border border-white/10 bg-slate-800 shadow-inner"
                >
                    {/* Background Layer (Impacted Vision) */}
                    <div className="absolute inset-0 w-full h-full grayscale-[0.3] brightness-50">
                        <img
                            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200"
                            alt="Vision Impacted"
                            className="w-full h-full object-cover blur-[8px]"
                        />
                        {/* Simulated Dark Spots */}
                        <div className="absolute inset-0 bg-black/30">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-black/60 blur-[15px]"
                                    style={{
                                        width: `${Math.random() * 80 + 40}px`,
                                        height: `${Math.random() * 60 + 30}px`,
                                        top: `${Math.random() * 90}%`,
                                        left: `${Math.random() * 90}%`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Reveal Layer (Clear Vision) */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            clipPath: clipPathValue,
                            WebkitClipPath: clipPathValue
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1200"
                            alt="Clear Reveal"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Lens Frame / Border */}
                    <motion.div
                        className="absolute pointer-events-none z-20 rounded-full border-2 border-teal-400 shadow-[0_0_50px_rgba(45,212,191,0.4)] flex items-center justify-center bg-teal-500/5 backdrop-blur-[2px]"
                        style={{
                            width: '200px',
                            height: '200px',
                            x: lensX,
                            y: lensY,
                            translateX: '-50%',
                            translateY: '-50%',
                            left: 0,
                            top: 0
                        }}
                    >
                        <div className="w-full h-full rounded-full border border-white/20 animate-pulse" />
                    </motion.div>

                    {/* Floating Label */}
                    <motion.div
                        className="absolute pointer-events-none z-30 bg-teal-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg"
                        style={{
                            x: lensX,
                            y: lensY,
                            translateX: '110px',
                            translateY: '-110px',
                            opacity: isHovering ? 1 : 0,
                            left: 0,
                            top: 0
                        }}
                    >
                        AI Insight: Healthy Center
                    </motion.div>

                    {/* Guidance Overlay */}
                    {!isHovering && (
                        <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500">
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center mx-auto mb-6"
                                >
                                    <div className="w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]" />
                                </motion.div>
                                <p className="text-white text-sm font-bold uppercase tracking-[0.3em]">Explore the Vision</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 -z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-0"></div>
        </section>
    );
};

export default VisionTeaser;
