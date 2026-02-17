import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

export interface ScanRecord {
    id: string;
    timestamp: number;
    label: string;
    confidence: number;
    severity: number;
}

export interface ViewedTopic {
    title: string;
    timestamp: number;
}

export interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    googleSignIn: () => Promise<void>;
    logout: () => Promise<void>;
    userRole: 'patient' | 'clinician';
    setRole: (role: 'patient' | 'clinician') => void;
    scanHistory: ScanRecord[];
    addScan: (scan: Omit<ScanRecord, 'id' | 'timestamp'>) => Promise<void>;
    viewedTopics: ViewedTopic[];
    markTopicViewed: (title: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
