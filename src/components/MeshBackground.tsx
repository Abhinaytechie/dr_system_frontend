import React from 'react';

const MeshBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-white/50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-pastel-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-pastel-blue rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pastel-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pastel-highlight rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-6000"></div>
        </div>
    );
};

export default MeshBackground;
