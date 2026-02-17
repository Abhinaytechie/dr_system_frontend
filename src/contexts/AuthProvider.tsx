import React, { useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';
import type { ScanRecord, ViewedTopic } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<'patient' | 'clinician'>(() => {
        const saved = localStorage.getItem('userRole');
        return (saved === 'clinician' || saved === 'patient') ? saved as any : 'patient';
    });

    const [scanHistory, setScanHistory] = useState<ScanRecord[]>(() => {
        const saved = localStorage.getItem('scanHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const [viewedTopics, setViewedTopics] = useState<ViewedTopic[]>(() => {
        const saved = localStorage.getItem('viewedTopics');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch data from Supabase
                const { data: scans, error: scansError } = await supabase
                    .from('scan_history')
                    .select('*')
                    .eq('user_id', user.uid)
                    .order('timestamp', { ascending: false });

                if (scansError) {
                    console.error('Error fetching scan history:', scansError.message, scansError.hint);
                } else if (scans) {
                    setScanHistory(scans);
                    localStorage.setItem('scanHistory', JSON.stringify(scans));
                }

                const { data: topics, error: topicsError } = await supabase
                    .from('viewed_topics')
                    .select('*')
                    .eq('user_id', user.uid);

                if (topicsError) {
                    console.error('Error fetching viewed topics:', topicsError.message, topicsError.hint);
                } else if (topics) {
                    setViewedTopics(topics);
                    localStorage.setItem('viewedTopics', JSON.stringify(topics));
                }
            } else {
                setScanHistory([]);
                setViewedTopics([]);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const setRole = (role: 'patient' | 'clinician') => {
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    const addScan = async (scan: Omit<ScanRecord, 'id' | 'timestamp'>) => {
        if (!currentUser) return;

        const newScan: ScanRecord = {
            ...scan,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        };

        const updated = [newScan, ...scanHistory].slice(0, 50);
        setScanHistory(updated);
        localStorage.setItem('scanHistory', JSON.stringify(updated));

        // Sync with Supabase
        const { error } = await supabase.from('scan_history').insert([{
            ...newScan,
            user_id: currentUser.uid
        }]);

        if (error) {
            console.error('Error syncing scan to Supabase:', error.message, error.hint);
        }
    };

    const markTopicViewed = async (title: string) => {
        if (!currentUser || viewedTopics.some(t => t.title === title)) return;

        const newTopic = { title, timestamp: Date.now() };
        const updated = [newTopic, ...viewedTopics];
        setViewedTopics(updated);
        localStorage.setItem('viewedTopics', JSON.stringify(updated));

        // Sync with Supabase
        const { error } = await supabase.from('viewed_topics').insert([{
            ...newTopic,
            user_id: currentUser.uid
        }]);

        if (error) {
            console.error('Error syncing topic to Supabase:', error.message, error.hint);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    const value = {
        currentUser,
        loading,
        googleSignIn,
        logout,
        userRole,
        setRole,
        scanHistory,
        addScan,
        viewedTopics,
        markTopicViewed
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
