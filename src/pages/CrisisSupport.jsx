import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, ShieldAlert, HeartHandshake, ArrowLeft, Loader, LifeBuoy, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import NatureBackground from '../components/NatureBackground';

const CrisisSupport = () => {
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    const speakCalm = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("You are safe. Please breathe. We are here with you. If you are in danger, please call the emergency number immediately. You are not alone.");
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1;
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.cancel(); // Clear potential queue
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    useEffect(() => {
        return () => stopSpeaking();
    }, []);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <NatureBackground />

            {/* Top Warning Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-status-danger animate-pulse z-20 shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl w-full glass-card p-10 md:p-14 relative overflow-hidden border-status-danger/20 bg-white/40 shadow-glass-light"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-status-danger via-status-danger/50 to-status-danger opacity-20" />

                <div className="w-24 h-24 bg-status-danger/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-glass-light shadow-status-danger/10">
                    <HeartHandshake className="text-status-danger" size={48} />
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight">You are not alone.</h1>
                <p className="text-lg text-gray-500 mb-12 font-medium leading-relaxed">
                    It takes immense strength to reach out. Please stay with us. We are preparing professional support for you right now.
                    Your safety is our only priority.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="tel:112"
                        className="flex flex-col items-center justify-center gap-4 p-8 bg-status-danger text-white rounded-[2.5rem] shadow-glass-light shadow-status-danger/30 group"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-status-danger transition-all duration-700">
                            <Phone size={24} />
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-xs">Emergency (112)</span>
                    </motion.a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isSpeaking ? stopSpeaking : speakCalm}
                        className={`flex flex-col items-center justify-center gap-4 p-8 text-white rounded-[2.5rem] shadow-glass-light shadow-black/20 group transition-all duration-700 ${isSpeaking ? 'bg-morning-accent-teal' : 'bg-gray-800'}`}
                    >
                        <div className={`w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white transition-all duration-700 ${isSpeaking ? 'group-hover:text-morning-accent-teal' : 'group-hover:text-gray-800'}`}>
                            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-xs">{isSpeaking ? "Silence Voice" : "Voice Guide"}</span>
                    </motion.button>
                </div>

                <div className="bg-white/60 p-8 rounded-[2.5rem] text-left border border-black/5 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <LifeBuoy size={100} className="text-status-danger" />
                    </div>

                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-status-danger mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-status-danger animate-ping"></span>
                        Immediate Helplines
                    </h3>

                    <ul className="space-y-6 relative z-10">
                        <li className="flex justify-between items-center group">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Suicide Prevention</p>
                                <p className="text-lg font-bold text-gray-800 group-hover:text-status-danger transition-colors">AASRA India</p>
                            </div>
                            <span className="text-xl font-black text-gray-800 bg-white px-4 py-2 rounded-xl shadow-glass-light">988</span>
                        </li>
                        <li className="flex justify-between items-center group">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student Distress</p>
                                <p className="text-lg font-bold text-gray-800 group-hover:text-status-danger transition-colors">Vandrevala Foundation</p>
                            </div>
                            <span className="text-xl font-black text-gray-800 bg-white px-4 py-2 rounded-xl shadow-glass-light">1860-266-2345</span>
                        </li>
                    </ul>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 text-status-danger font-bold text-[10px] uppercase tracking-[0.3em]">
                        <Loader className="animate-spin" size={14} />
                        Connecting to nearest expert...
                    </div>

                    <Link to="/" className="text-gray-400 hover:text-gray-800 text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2 group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit Crisis Mode (I am Safe)
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default CrisisSupport;
