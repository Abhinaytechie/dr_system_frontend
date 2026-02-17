import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Results from './Results';

interface ImageUploadProps {
    onResult: (result: any) => void;
    result: any | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onResult, result }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Please upload a JPG or PNG image.");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("File is too large. Please upload an image smaller than 5MB.");
            return false;
        }
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedInfo = e.target.files[0];
            if (validateFile(selectedInfo)) {
                setFile(selectedInfo);
                setPreview(URL.createObjectURL(selectedInfo));
                onResult(null);
                setError(null);
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedInfo = e.dataTransfer.files[0];
            if (validateFile(selectedInfo)) {
                setFile(selectedInfo);
                setPreview(URL.createObjectURL(selectedInfo));
                onResult(null);
                setError(null);
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onResult(response.data);
        } catch (err) {
            setError("Failed to process image. Please ensure the backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        onResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 pb-12">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-medical-accent/50 bg-medical-blue/30' : 'border-gray-300 hover:border-medical-accent bg-white'
                    }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {!file ? (
                    <div className="space-y-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-medical-accent">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">Retinal fundus images only (JPG, PNG)</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); clearFile(); }}
                            className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img src={preview!} alt="Preview" className="max-h-80 mx-auto rounded-lg shadow-sm" />
                        <p className="mt-4 text-sm font-medium text-gray-700">{file.name}</p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {file && !result && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`
                            px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105
                            ${loading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-medical-accent text-white hover:bg-teal-700'
                            }
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center space-x-2">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>Analyzing Image...</span>
                            </span>
                        ) : 'Run AI Analysis'}
                    </button>
                    {loading && <p className="mt-4 text-sm text-gray-500 animate-pulse">This may take a few seconds...</p>}
                </div>
            )}

            {result && <Results data={result} />}
        </div>
    );
};

export default ImageUpload;
