import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader2, CheckCircle2, AlertCircle, Sparkles, Brain } from 'lucide-react';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const eyeCareTips = [
    "Diabetic retinopathy often has no symptoms in its early stages.",
    "Regular eye exams can reduce the risk of severe vision loss by 95%.",
    "Stable blood sugar levels are the best defense against eye damage.",
    "The retina is the only place in the body where blood vessels can be seen directly!",
    "Diabetic retinopathy is a leading cause of vision loss in working-age adults.",
    "Early detection allows for treatments that can save your sight."
];

const loadingSteps = [
    "Reading your medical report...",
    "Extracting key clinical data...",
    "Scanning for signs of retinopathy...",
    "Analyzing severity stages...",
    "Simplifying medical terminology...",
    "Finalizing your AI review..."
];

interface ReportUploaderProps {
    onAnalysisComplete: (analysis: string) => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [tipIndex, setTipIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: any;
        if (uploading) {
            setProgress(0);
            setTipIndex(0);
            setStepIndex(0);
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 1; // 1% every 100ms = 10s
                    return next >= 98 ? 98 : next;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [uploading]);

    useEffect(() => {
        let tipInterval: any;
        let stepInterval: any;
        if (uploading) {
            tipInterval = setInterval(() => {
                setTipIndex(prev => (prev + 1) % eyeCareTips.length);
            }, 3500);

            stepInterval = setInterval(() => {
                setStepIndex(prev => (prev + 1) % loadingSteps.length);
            }, 2000);
        }
        return () => {
            clearInterval(tipInterval);
            clearInterval(stepInterval);
        };
    }, [uploading]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
            setAnalysis(null);
        } else {
            setError('Please upload a valid PDF report.');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/analyze-report-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setAnalysis(response.data.analysis);
            onAnalysisComplete(response.data.analysis);
        } catch (err: any) {
            console.error('PDF Upload Error:', err);
            setError(err.response?.data?.detail || 'Failed to analyze the report. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Medical Report Review</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Upload your medical reports (PDF) to get a comprehensive AI review and simplified explanation of your results.
                </p>
            </div>

            {!analysis ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50">
                    <div
                        {...getRootProps()}
                        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-slate-50'}`}
                    >
                        <input {...getInputProps()} />

                        <div className="space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner group-hover:bg-accent/10">
                                {file ? (
                                    <FileText className="w-10 h-10 text-slate-700 group-hover:text-accent transition-colors" />
                                ) : (
                                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-accent transition-colors" />
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-lg font-semibold text-gray-900">
                                    {file ? file.name : (isDragActive ? 'Drop the PDF here' : 'Drag & drop your report')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Only PDF files supported'}
                                </p>
                            </div>

                            {!file && (
                                <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    Browse Files
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {file && !uploading && !analysis && (
                        <button
                            onClick={handleUpload}
                            className="w-full mt-8 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(15,23,42,0.3)] hover:bg-black hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Sparkles className="w-5 h-5 text-accent" />
                            Start AI Analysis
                        </button>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 z-50 p-2 animate-fade-in bg-white/10 backdrop-blur-sm rounded-[2.5rem]">
                            <div className="h-full bg-slate-900 rounded-[2.2rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40 animate-pulse delay-700"></div>

                                <div className="relative z-10 space-y-12">
                                    <div className="flex flex-col items-center text-center space-y-8">
                                        <div className="relative">
                                            <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-2xl">
                                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-xl animate-bounce">
                                                <Brain className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="space-y-5 w-full max-w-md">
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                                    {loadingSteps[stepIndex]}
                                                </h3>
                                                <p className="text-xs text-accent font-bold uppercase tracking-[4px]">Processing</p>
                                            </div>
                                            <div className="relative pt-2">
                                                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full shadow-[0_0_25px_rgba(45,212,191,0.6)]"
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-6 left-0 right-0 flex justify-between items-center px-1">
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Medical Intelligence Active</p>
                                                    <p className="text-[10px] text-accent font-black">{Math.floor(progress)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-md relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={tipIndex}
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -30 }}
                                                transition={{ duration: 0.6 }}
                                                className="flex items-center gap-8"
                                            >
                                                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/30">
                                                    <Sparkles className="w-8 h-8 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                                                        <p className="text-[10px] font-black uppercase tracking-[5px] text-primary">Retina Fact</p>
                                                    </div>
                                                    <p className="text-xl text-gray-50 leading-tight font-bold italic">
                                                        "{eyeCareTips[tipIndex]}"
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Analysis Summary</h3>
                                <p className="text-gray-500 text-sm">Reviewing: {file?.name}</p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none 
                prose-p:leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold
                prose-table:border-collapse prose-table:w-full prose-table:my-6
                prose-th:bg-slate-50 prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-slate-200 prose-th:font-semibold
                prose-td:p-4 prose-td:border prose-td:border-slate-200 prose-td:text-sm prose-td:text-slate-600
                prose-li:text-slate-600 prose-strong:text-gray-900
                bg-slate-50/50 p-6 rounded-2xl border border-slate-100"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setAnalysis(null);
                                    setFile(null);
                                }}
                                className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                Analyze Another Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                            <p className="text-amber-900 font-semibold mb-1">Medical Disclaimer</p>
                            <p className="text-amber-800/80 text-sm leading-relaxed">
                                This analysis is generated by AI for educational purposes only. It is not a clinical diagnosis.
                                Always consult with a qualified healthcare professional regarding any medical results or symptoms.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportUploader;
