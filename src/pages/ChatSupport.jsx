import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Bot, AlertTriangle, Phone, ShieldAlert, Trash2, Clock, Mic, MicOff, Sparkles, Moon, Wind, Sun } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ChatSupport = () => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'ai',
            text: t('chat.welcomeMessage'),
            timestamp: new Date()
        }
    ]);

    useEffect(() => {
        setMessages(prev => prev.map(msg =>
            msg.id === 'welcome' ? { ...msg, text: t('chat.welcomeMessage') } : msg
        ));
    }, [t, i18n.language]);

    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
                toast.error(t('chat.reflectionLost'));
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error(t('chat.voiceNotSupported'));
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: userText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        try {
            const response = await api.post('/chat/analyze', { message: userText });
            const { message: aiText, level } = response.data;

            if (level === 'high') {
                setTimeout(() => navigate('/crisis'), 2500);
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: aiText,
                timestamp: new Date(),
                isCrisis: level === 'high'
            }]);

        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'ai',
                text: t('chat.errorResponse'),
                timestamp: new Date()
            }]);
        } finally {
            setTyping(false);
        }
    };

    const clearChat = () => {
        if (window.confirm(t('chat.clearConfirm'))) {
            setMessages([{
                id: 'welcome',
                sender: 'ai',
                text: t('chat.clearedMessage'),
                timestamp: new Date()
            }]);
        }
    };

    const suggestions = [
        t('chat.suggestions.fresh'),
        t('chat.suggestions.clarity'),
        t('chat.suggestions.expectations'),
        t('chat.suggestions.guide')
    ];

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col glass-card bg-white/40 shadow-glass-light overflow-hidden relative border-black/5">
            {/* Header */}
            <header className="bg-white/60 backdrop-blur-xl p-8 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-white border border-black/5 rounded-[2rem] flex items-center justify-center shadow-glass-light group overflow-hidden">
                            <Bot size={32} className="text-morning-accent-lavender relative z-10 group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-morning-accent-lavender/5 animate-pulse" />
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-morning-accent-teal border-4 border-white rounded-full shadow-[0_0_15px_rgba(111,205,193,0.4)]"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-800 text-xl tracking-tight">{t('chat.headerTitle')}</h3>
                            <Sparkles size={16} className="text-morning-accent-amber animate-pulse" />
                            <Sun size={16} className="text-morning-accent-amber animate-spin-slow" />
                        </div>
                        <p className="text-[10px] font-black text-morning-accent-lavender uppercase tracking-[0.4em] mt-1">{t('chat.headerSubtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={clearChat}
                        className="p-4 text-gray-400 hover:text-morning-accent-rose hover:bg-black/5 rounded-2xl transition-all duration-700"
                        title="Clear Mist"
                    >
                        <Trash2 size={24} />
                    </button>
                    <button
                        onClick={() => navigate('/crisis')}
                        className="p-4 text-gray-400 hover:text-status-danger hover:bg-status-danger/5 rounded-2xl transition-all duration-700"
                    >
                        <AlertTriangle size={24} />
                    </button>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth selection:bg-morning-accent-lavender/20 no-scrollbar">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end pl-16' : 'justify-start pr-16'} items-end gap-5`}
                        >
                            {msg.sender === 'ai' && (
                                <div className="w-10 h-10 rounded-2xl bg-white border border-black/5 shadow-glass-light flex items-center justify-center shrink-0 mb-2">
                                    <Sun size={18} className="text-gray-300" />
                                </div>
                            )}

                            <div className={`group relative max-w-[85%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                                <div className={`px-8 py-5 rounded-[2.5rem] shadow-glass-light transition-all duration-1000 ${msg.sender === 'user'
                                    ? 'bg-morning-accent-lavender/10 text-gray-800 border border-morning-accent-lavender/20 rounded-br-none'
                                    : msg.isCrisis
                                        ? 'bg-status-danger/10 text-status-danger border border-status-danger/10 rounded-bl-none font-bold'
                                        : 'bg-white/60 text-gray-700 rounded-bl-none border border-black/5'
                                    }`}>
                                    <p className="text-base md:text-lg leading-relaxed tracking-wide font-medium">{msg.text}</p>
                                </div>
                                <div className={`flex items-center gap-2 mt-3 text-[9px] font-black text-gray-400 uppercase tracking-widest ${msg.sender === 'user' ? 'justify-end pr-4' : 'justify-start pl-4'}`}>
                                    {format(msg.timestamp, 'p')}
                                </div>
                            </div>

                            {msg.sender === 'user' && (
                                <div className="w-10 h-10 rounded-2xl bg-morning-accent-lavender/20 border border-morning-accent-lavender/40 flex items-center justify-center shrink-0 mb-2 order-2 shadow-xl shadow-morning-accent-lavender/5">
                                    <UserIcon size={18} className="text-morning-accent-lavender" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {typing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-black/5 shadow-glass-light flex items-center justify-center shrink-0">
                                <Sun size={18} className="text-gray-300" />
                            </div>
                            <div className="bg-white/60 border border-black/5 rounded-[2rem] px-8 py-5 rounded-bl-none flex items-center gap-2.5 shadow-glass-light">
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 bg-morning-accent-lavender rounded-full" />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }} className="w-2 h-2 bg-morning-accent-teal rounded-full" />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.8 }} className="w-2 h-2 bg-morning-accent-amber rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-8 bg-white/40 border-t border-black/5 backdrop-blur-3xl">
                <div className="mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="whitespace-nowrap px-6 py-3 bg-white/60 border border-black/5 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:border-morning-accent-lavender hover:text-morning-accent-lavender hover:bg-white/80 transition-all duration-1000 shadow-soft"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSend} className="relative flex items-center gap-6">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            className="w-full px-10 py-6 rounded-[2.5rem] bg-white/60 border border-black/5 focus:border-morning-accent-lavender/30 focus:ring-[15px] focus:ring-morning-accent-lavender/5 outline-none transition-all duration-1000 text-lg font-medium text-gray-800 placeholder:text-gray-300 shadow-glass-light"
                            placeholder={isListening ? t('chat.listeningPlaceholder') : t('chat.inputPlaceholder')}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${isListening ? 'bg-status-danger text-white shadow-2xl shadow-status-danger/40' : 'text-gray-400 hover:text-gray-600 hover:bg-black/5'}`}
                        >
                            {isListening ? <MicOff size={24} className="animate-pulse" /> : <Mic size={24} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="w-20 h-20 bg-morning-accent-teal text-white rounded-[2.2rem] flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-10 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl hover:shadow-morning-accent-teal/20 transition-all duration-1000 border border-black/5"
                    >
                        <Send size={28} />
                    </button>
                </form>
                <div className="mt-6 flex items-center justify-center gap-4 opacity-30 select-none">
                    <div className="h-px w-10 bg-gray-300" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.5em]">
                        {t('chat.privacyNote')}
                    </p>
                    <div className="h-px w-10 bg-gray-300" />
                </div>
            </footer>
        </div>
    );
};

export default ChatSupport;
