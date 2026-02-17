import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Stethoscope } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const { currentUser, logout, userRole, setRole } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const links = [
        { name: 'Home', path: '/' },
        ...(userRole === 'clinician' ? [{ name: 'Screening', path: '/detect' }] : []),
        ...(userRole === 'patient' ? [
            { name: 'Analyze Report', path: '/analyze' },
            { name: 'Learn', path: '/education' }
        ] : []),
        { name: 'Disclaimer', path: '/disclaimer' },
    ];

    return (
        <div className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8`}>
            <div className={`
                max-w-7xl mx-auto rounded-2xl 
                bg-white/70 backdrop-blur-md shadow-sm border border-white/40
                flex items-center justify-between px-6 py-4
                transition-all duration-300
                ${scrolled ? 'shadow-md bg-white/80' : ''}
            `}>
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                        <span className="text-medical-accent">RetinaAI</span> Screening
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${isActive ? 'text-medical-accent' : 'text-gray-600 hover:text-gray-900'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-100 z-[-1]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    {/* Role Toggle */}
                    {currentUser && (
                        <div className="flex items-center bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
                            <button
                                onClick={() => setRole('patient')}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${userRole === 'patient'
                                        ? 'bg-white text-medical-accent shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'}
                                `}
                            >
                                <User className="w-3.5 h-3.5" />
                                Patient
                            </button>
                            <button
                                onClick={() => setRole('clinician')}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${userRole === 'clinician'
                                        ? 'bg-medical-accent text-white shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'}
                                `}
                            >
                                <Stethoscope className="w-3.5 h-3.5" />
                                Clinician
                            </button>
                        </div>
                    )}

                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/profile"
                                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-medical-accent transition-colors group"
                            >
                                <div className="p-1.5 bg-gray-100 rounded-full group-hover:bg-teal-50 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="font-medium">{currentUser.displayName || currentUser.email}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-medical-accent transition-colors">
                                Log In
                            </Link>
                            <Link to="/signup" className="hidden sm:block text-sm font-semibold text-white bg-medical-accent px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
