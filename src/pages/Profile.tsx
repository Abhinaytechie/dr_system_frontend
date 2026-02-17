import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import MeshBackground from '../components/MeshBackground';
import {
    User,
    Mail,
    Clock,
    LineChart,
    Settings,
    LogOut,
    Stethoscope,
    BookOpen,
    Camera,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { currentUser, userRole, logout, setRole, scanHistory, viewedTopics } = useAuth();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] pb-20 overflow-hidden">
            <MeshBackground />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-3 gap-8"
                >
                    {/* Left Column: User Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl flex flex-col items-center">
                            <div className="relative group mb-6">
                                <div className="w-32 h-32 bg-medical-blue/30 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-medical-accent/50" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-medical-accent transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-gray-800 mb-1">{currentUser.displayName || "User Name"}</h2>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6 ${userRole === 'clinician' ? 'bg-medical-accent text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {userRole === 'clinician' ? <Stethoscope className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                {userRole} Mode
                            </div>

                            <div className="w-full space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 opacity-50" />
                                    <span className="truncate">{currentUser.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="w-4 h-4 opacity-50" />
                                    <span>Joined {new Date(currentUser.metadata.creationTime || '').toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            onClick={handleLogout}
                            className="w-full bg-white/50 backdrop-blur-md hover:bg-red-50 hover:text-red-600 text-gray-600 p-4 rounded-2xl border border-white transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out of RetinaAI
                        </motion.button>
                    </div>

                    {/* Right Column: Role-Specific Dashboard */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Stats */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm transition-transform hover:-translate-y-1">
                                <div className="text-medical-accent mb-2"><Activity className="w-6 h-6" /></div>
                                <div className="text-2xl font-black text-gray-800">
                                    {userRole === 'clinician' ? scanHistory.length : viewedTopics.length * 10}
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                    {userRole === 'clinician' ? "Scans Performed" : "Knowledge Points"}
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm transition-transform hover:-translate-y-1">
                                <div className="text-teal-600 mb-2"><LineChart className="w-6 h-6" /></div>
                                <div className="text-2xl font-black text-gray-800">
                                    {userRole === 'clinician'
                                        ? (scanHistory.length > 0
                                            ? (scanHistory.reduce((acc, s) => acc + s.confidence, 0) / scanHistory.length * 100).toFixed(1) + "%"
                                            : "0%")
                                        : (scanHistory.length > 0 ? `Stage ${scanHistory[0].severity}` : "Not Scanned")}
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                    {userRole === 'clinician' ? "Avg. Precision" : "Health Status"}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {userRole === 'clinician' ? (
                                        <><Stethoscope className="w-5 h-5 text-medical-accent" /> Screening History</>
                                    ) : (
                                        <><BookOpen className="w-5 h-5 text-teal-600" /> Learning Progress</>
                                    )}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {userRole === 'clinician' ? (
                                    scanHistory.length > 0 ? (
                                        scanHistory.map((scan, idx) => (
                                            <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-medical-accent">
                                                        #{scanHistory.length - idx}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{scan.label}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {(scan.confidence * 100).toFixed(1)}% Confidence • {new Date(scan.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 italic">No screenings recorded yet.</div>
                                    )
                                ) : (
                                    viewedTopics.length > 0 ? (
                                        viewedTopics.map((topic, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all">
                                                <div className="flex items-center gap-4 text-teal-600">
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{topic.title}</h4>
                                                        <p className="text-xs text-gray-500">Completed on {new Date(topic.timestamp).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 italic">No topics explored yet. Start learning in the Hub!</div>
                                    )
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Settings */}
                        <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-400" /> Account Preferences
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 group-hover:text-medical-accent transition-colors">Role Management</span>
                                        <span className="text-xs text-gray-400">Manage how you interact with the platform</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex bg-gray-100 p-1 rounded-xl">
                                            <button
                                                onClick={() => setRole('patient')}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${userRole === 'patient' ? 'bg-white text-medical-accent shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Patient
                                            </button>
                                            <button
                                                onClick={() => setRole('clinician')}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${userRole === 'clinician' ? 'bg-medical-accent text-white shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Clinician
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 group-hover:text-medical-accent transition-colors">Notifications</span>
                                        <span className="text-xs text-gray-400">Clinical alerts and wellness reminders</span>
                                    </div>
                                    <div className="w-10 h-6 bg-medical-accent rounded-full flex items-center px-1">
                                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
