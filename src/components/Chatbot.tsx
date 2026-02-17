import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../contexts/AuthContext';
import { User, Stethoscope } from 'lucide-react';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

interface ChatbotProps {
    context?: any;
}

const Chatbot: React.FC<ChatbotProps> = ({ context }) => {
    const { userRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I can answer questions about Diabetic Retinopathy symptoms, prevention, and treatment.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestQuestions = userRole === 'clinician'
        ? ["Clinical significance of Grade 2?", "Confidence score meaning?", "Explain Grad-CAM overlay"]
        : ["What are the symptoms?", "How is it treated?", "Can it be prevented?"];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (context) {
            setIsOpen(true);
            const isPDF = typeof context === 'string';
            const greeting = isPDF
                ? "I've reviewed the analysis of your medical report. Do you have any specific questions about the findings or next steps?"
                : "I see your screening results. I can help explain the findings or answer any questions you have about the assessment.";

            // Only add if not already the last message to avoid duplicates on re-renders
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg.text === greeting) return prev;
                return [...prev, { text: greeting, sender: 'bot' }];
            });
        }
    }, [context]);

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        const userMessage = text;
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/chat', {
                message: userMessage,
                prediction_result: context,
                user_role: userRole
            });
            setMessages(prev => [...prev, { text: res.data.response, sender: 'bot' }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-medical-accent hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center space-x-2"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">Medical Assistant</span>
                </button>
            ) : (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[550px] border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center text-gray-800">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-teal-50 rounded-lg">
                                <MessageCircle className="w-5 h-5 text-medical-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Assistant</h3>
                                <div className="flex items-center space-x-2">
                                    <div className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${userRole === 'clinician' ? 'bg-medical-accent text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {userRole === 'clinician' ? <Stethoscope className="w-2 h-2" /> : <User className="w-2 h-2" />}
                                        {userRole} Mode
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        <span className="text-[10px] text-gray-400">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Minimize2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-gray-800 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    {msg.sender === 'user' ? (
                                        msg.text
                                    ) : (
                                        <div className="prose prose-sm max-w-none 
                                            prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0
                                            prose-table:border-collapse prose-table:border prose-table:border-gray-200 prose-table:w-full
                                            prose-th:bg-gray-50 prose-th:p-2 prose-th:text-left prose-th:border prose-th:border-gray-200
                                            prose-td:p-2 prose-td:border prose-td:border-gray-200"
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length < 3 && !loading && (
                        <div className="px-4 pb-2 bg-gray-50/50 flex gap-2 overflow-x-auto no-scrollbar">
                            {suggestQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(q)}
                                    className="flex-shrink-0 text-xs bg-white border border-medical-accent/30 text-medical-accent px-3 py-1.5 rounded-full hover:bg-medical-accent hover:text-white transition-colors whitespace-nowrap"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your health question..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-medical-accent focus:ring-1 focus:ring-medical-accent transition-all"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 top-2 p-1.5 bg-medical-accent text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-medical-accent transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Educational info only. Not medical advice.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
