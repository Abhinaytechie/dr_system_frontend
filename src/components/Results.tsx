import React, { useState } from 'react';
import { AlertCircle, Info, CheckCircle, Download, Loader2, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import Timeline from './Timeline';

interface ResultsProps {
    data: {
        severity: number;
        label: string;
        confidence: number;
        heatmap?: string | null;
        class_name?: string;
    };
}

const Results: React.FC<ResultsProps> = ({ data }) => {
    const { userRole, addScan } = useAuth();
    if (!data) return null;
    const [downloading, setDownloading] = useState(false);

    // Track the scan in history if clinician
    React.useEffect(() => {
        if (userRole === 'clinician' && data) {
            addScan({
                label: data.label || data.class_name || 'Unknown',
                confidence: data.confidence,
                severity: data.severity
            });
        }
    }, []); // Only run once on mount

    const downloadReport = async () => {
        setDownloading(true);
        try {
            const response = await api.post('/download-report', {
                prediction_result: data,
                user_message: ""
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `DR_Screening_Report_${new Date().getTime()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const getSeverityStyles = (severity: number) => {
        if (severity === 0) return {
            bg: 'bg-teal-50',
            border: 'border-teal-200',
            text: 'text-teal-900',
            icon: <CheckCircle className="w-8 h-8 text-teal-600 opacity-80" />
        };
        if (severity <= 2) return {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-900',
            icon: <Info className="w-8 h-8 text-amber-600 opacity-80" />
        };
        return {
            bg: 'bg-slate-100',
            border: 'border-slate-300',
            text: 'text-slate-900',
            icon: <AlertCircle className="w-8 h-8 text-slate-600 opacity-80" />
        };
    };

    const styles = getSeverityStyles(data.severity);
    const isNormal = data.severity === 0;

    return (
        <div className="mt-8 space-y-6 animate-fade-in">
            <div className={`p-8 rounded-2xl border ${styles.bg} ${styles.border} shadow-sm`}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                    <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm">
                        {styles.icon}
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">Assessment Result</h3>
                                <p className={`text-3xl font-bold ${styles.text} mb-2`}>{data.label || data.class_name}</p>
                                {userRole === 'clinician' && (
                                    <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-medical-accent transition-all duration-1000"
                                                style={{ width: `${data.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">{(data.confidence * 100).toFixed(1)}% Confidence</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={downloadReport}
                                disabled={downloading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50"
                            >
                                {downloading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                Clinical Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`mt-6 p-4 rounded-xl ${isNormal ? 'bg-green-100/50 text-green-800' : 'bg-amber-100/50 text-amber-800'}`}>
                    <p className="text-sm leading-relaxed">
                        {userRole === 'clinician'
                            ? `Automated screening identified ${(data.label || data.class_name || '').toLowerCase()} with a confidence of ${(data.confidence * 100).toFixed(1)}%. This requires clinical verification.`
                            : "The AI analysis has provided an assessment of the retinal image. Please consult with an eye specialist for a formal diagnosis and treatment plan."
                        }
                    </p>
                </div>

                {userRole === 'clinician' && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-medical-text opacity-70">
                            <Stethoscope className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest">Clinical Analysis Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Index Score</span>
                                <span className="text-lg font-mono font-bold text-medical-accent">{data.confidence.toFixed(4)}</span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Inference Type</span>
                                <span className="text-lg font-mono font-bold text-gray-700 uppercase">Hybrid CNN-T</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {data.heatmap && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-6 bg-medical-accent rounded-full"></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Diagnostic Insight: Area of Interest</h3>
                    </div>
                    <div className="grid md:grid-cols-1 gap-6 items-start">
                        <div className="relative group">
                            <img
                                src={`data:image/jpeg;base64,${data.heatmap}`}
                                alt="AI Heatmap"
                                className="w-full rounded-xl shadow-inner border border-gray-100"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">AI Feature Localization (Grad-CAM)</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                <strong className="text-medical-accent block mb-1 uppercase tracking-tighter">AI Interpretation:</strong>
                                This heatmap highlights the regions in the fundus image that influenced the AI detection.
                                The <span className="text-red-600 font-bold">intensive red regions</span> indicate where markers of Diabetic Retinopathy (like hemorrhages or exudates) were identified.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Condition Progression</h3>
                <Timeline activeStage={data.severity} />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Important Medical Disclaimer</h3>
                        <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                            <p>
                                This analysis is generated by an AI screening tool for <strong>educational purposes only</strong>.
                                It does not replace a comprehensive eye exam.
                            </p>
                            <p className="mt-2">
                                Regardless of this result, regular screenings with a certified ophthalmologist are essential for diabetic eye health.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
