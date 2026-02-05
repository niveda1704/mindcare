import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Volume2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const VoiceCompanion = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
    const [transcript, setTranscript] = useState('');
    const [aiResponseText, setAiResponseText] = useState('');
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    // IMPORTANT: Store utterance in ref to prevent garbage collection mid-speech (Chrome bug)
    const utteranceRef = useRef(null);
    const { user } = useAuth();
    const { t } = useTranslation();


    const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const isTTSSupported = 'speechSynthesis' in window;

    useEffect(() => {
        if (isTTSSupported) {
            const loadVoices = () => {
                synthRef.current.getVoices();
            };
            loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }, [isTTSSupported]);

    useEffect(() => {
        if (isSpeechSupported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setStatus('listening');
            };

            recognitionRef.current.onresult = (event) => {
                const currentTranscript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                if (status === 'listening') {
                    setTimeout(() => {
                        setStatus(prev => prev === 'listening' ? 'processing' : prev);
                    }, 500);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Voice Error", event);
                setStatus('idle');
            };
        }
    }, []);




    const startListening = () => {
        if (!isSpeechSupported) {
            alert("Voice features not supported in this browser.");
            return;
        }

        // PRIME THE PUMP: Trigger a silent speak on user gesture to unlock audio context
        if (isTTSSupported) {
            synthRef.current.cancel();
            const silent = new SpeechSynthesisUtterance('');
            silent.volume = 0;
            // Short timeout to let it 'play'
            silent.onend = () => console.log("Audio Context Unlocked");
            synthRef.current.speak(silent);
        }

        setTranscript('');
        setStatus('listening');
        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        // Manual State Override: Don't wait for onend since it can be flaky
        if (transcript && transcript.trim().length > 0) {
            setStatus('processing');
        } else {
            // If nothing was heard, go back to idle immediately
            setStatus('idle');
            setAiResponseText("I didn't catch that. Please try again.");
        }
    };

    const [recommendations, setRecommendations] = useState([]);

    const handleSend = async (text) => {
        try {
            const response = await api.post('/chat/analyze', { message: text });
            // Extract message and recommendations from the new API structure
            const { message: aiText, recommendations: recs } = response.data;

            setAiResponseText(aiText);

            let textToSpeak = aiText;
            if (recs && recs.length > 0) {
                setRecommendations(recs);
                // Append announcement for recommendations
                textToSpeak += " Here are some recommended videos for you. Kindly look at this to calm your mind.";
            }

            // Ensure state updates before speaking
            speakResponse(textToSpeak);
        } catch (error) {
            console.error("AI Error", error);
            setStatus('idle');
            const errorMsg = t('voice.connectionError');
            setAiResponseText(errorMsg);
            speakResponse(errorMsg);
        }
    };

    const speakResponse = (text) => {
        if (!isTTSSupported) return;

        // Vital fix: Ensure audio context is resumed (Chrome autopauses it)
        if (synthRef.current.paused || !synthRef.current.speaking) {
            synthRef.current.resume();
        }

        // Cancel existing
        synthRef.current.cancel();

        setStatus('speaking');

        // Create new utterance and store in Ref
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Note: We use the system default voice for maximum reliability across browsers.
        // Specialized voice selection caused silence issues for some users.

        // Standard settings to ensure audibility
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
            setStatus('idle');
            setTranscript('');
        };

        utterance.onerror = (e) => {
            console.error("TTS Error", e);
            setStatus('idle');
        };

        console.log("Speaking (Default Voice):", text);
        synthRef.current.speak(utterance);
    };

    const cancelEverything = () => {
        synthRef.current.cancel();
        if (status === 'listening' && recognitionRef.current) recognitionRef.current.stop();
        setIsOpen(false);
        setStatus('idle');
        setRecommendations([]);
    };

    const retrySpeech = () => {
        if (aiResponseText) speakResponse(aiResponseText);
    };

    useEffect(() => {
        if (status === 'processing' && transcript.trim()) {
            handleSend(transcript);
        } else if (status === 'processing' && !transcript.trim()) {
            setStatus('idle');
        }
    }, [status, transcript]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white border-2 border-white/20 backdrop-blur-md"
            >
                <Mic size={28} />
                <div className="absolute inset-0 rounded-full animate-ping bg-white/20 opacity-20" />
            </motion.button>

            {/* Overlay Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-gray-900/90 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                        >
                            {/* Exit Button */}
                            <button
                                onClick={cancelEverything}
                                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            {/* Content */}
                            <div className="flex flex-col items-center justify-center space-y-8 py-8">

                                {/* Status Indicator / Visualizer */}
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    {/* Rings */}
                                    {(status === 'listening' || status === 'speaking') && (
                                        <>
                                            <motion.div
                                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className={`absolute inset-0 rounded-full ${status === 'listening' ? 'bg-indigo-500/30' : 'bg-emerald-500/30'}`}
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                                className={`absolute inset-0 rounded-full ${status === 'listening' ? 'bg-indigo-500/30' : 'bg-emerald-500/30'}`}
                                            />
                                        </>
                                    )}

                                    {/* Icon */}
                                    <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-colors duration-500 ${status === 'listening' ? 'bg-indigo-500 text-white' :
                                        status === 'speaking' ? 'bg-emerald-500 text-white' :
                                            status === 'processing' ? 'bg-amber-500 text-white' :
                                                'bg-gray-800 text-gray-400'
                                        }`}>
                                        {status === 'listening' && <Mic size={40} />}
                                        {status === 'speaking' && <Volume2 size={40} />}
                                        {status === 'processing' && <Loader2 size={40} className="animate-spin" />}
                                        {status === 'idle' && <Sparkles size={40} />}
                                    </div>
                                </div>

                                {/* Text Area */}
                                <div className="text-center space-y-2 max-w-xs">
                                    <h3 className="text-xl font-medium text-white tracking-wide">
                                        {status === 'idle' && t('voice.status.idle')}
                                        {status === 'listening' && t('voice.status.listening')}
                                        {status === 'processing' && t('voice.status.processing')}
                                        {status === 'speaking' && t('voice.status.speaking')}
                                    </h3>

                                    <div className="h-24 flex items-center justify-center overflow-y-auto no-scrollbar">
                                        {status === 'listening' && (
                                            <p className="text-white/70 text-sm font-light italic">"{transcript}"</p>
                                        )}
                                        {status === 'speaking' && (
                                            <p className="text-emerald-400/90 text-sm font-medium leading-relaxed">"{aiResponseText}"</p>
                                        )}
                                        {status === 'idle' && !aiResponseText && (
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-white/40 text-sm">{t('voice.tapPrompt')}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => speakResponse(t('voice.testAudioText'))}
                                                        className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white/50 transition-colors"
                                                    >
                                                        {t('voice.testVoiceBtn')}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            console.log("Forcing Native Test");
                                                            window.speechSynthesis.cancel();
                                                            window.speechSynthesis.resume();
                                                            const u = new SpeechSynthesisUtterance("System check.");
                                                            window.speechSynthesis.speak(u);
                                                        }}
                                                        className="text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1 rounded-full text-indigo-300 transition-colors"
                                                    >
                                                        {t('voice.forceSoundBtn')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {status === 'idle' && aiResponseText && (
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-white/60 text-xs line-clamp-2">"{aiResponseText}"</p>
                                                <button onClick={retrySpeech} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                                    <Volume2 size={12} /> {t('voice.replayBtn')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Control Button */}
                                {status === 'idle' ? (
                                    <button
                                        onClick={startListening}
                                        className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                                    >
                                        <Mic size={18} />
                                        <span>{t('voice.tapToTalk')}</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={status === 'listening' ? stopListening : cancelEverything}
                                        className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                                    >
                                        {status === 'listening' ? t('voice.stopBtn') : t('voice.cancelBtn')}
                                    </button>
                                )}

                            </div>

                            {/* Recommendations Section */}
                            {recommendations.length > 0 && status === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-6 pb-6 w-full"
                                >
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 text-center">
                                        {t('voice.recommendedForYou') || "RECOMMENDED FOR YOU"}
                                    </p>
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                                        {recommendations.map((rec, idx) => (
                                            <a
                                                key={idx}
                                                href={rec.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-shrink-0 w-48 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-all snap-center group cursor-pointer block"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${rec.category === 'Anxiety' ? 'bg-teal-400' : 'bg-purple-400'}`} />
                                                    <span className="text-[9px] text-white/50 uppercase tracking-wider truncate">{rec.category}</span>
                                                </div>
                                                <p className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                                                    {rec.title}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceCompanion;
