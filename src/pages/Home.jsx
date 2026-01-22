import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, Users, BookOpen, Smile, Frown, Meh, CloudRain, Sun, Moon, ClipboardCheck, TrendingUp, History, Loader, Sparkles, Wind, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import welcomeGirlV2 from '../assets/welcome_girl_v2.png';
import { useTranslation } from 'react-i18next';


const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (user?.role === 'admin') navigate('/admin');
        else if (user?.role === 'counselor') navigate('/counselor');
    }, [user, navigate]);
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // Instant logging enabled
    const [quote, setQuote] = useState("");

    const moods = [
        { id: 'very_happy', icon: Sparkles, label: t('home.moods.radiant'), color: 'text-morning-accent-amber', bg: 'bg-morning-accent-amber/10', value: 5 },
        { id: 'happy', icon: Smile, label: t('home.moods.peaceful'), color: 'text-morning-accent-teal', bg: 'bg-morning-accent-teal/10', value: 4 },
        { id: 'neutral', icon: Meh, label: t('home.moods.steady'), color: 'text-morning-accent-lavender', bg: 'bg-morning-accent-lavender/10', value: 3 },
        { id: 'sad', icon: Frown, label: t('home.moods.heavy'), color: 'text-morning-accent-rose', bg: 'bg-morning-accent-rose/10', value: 2 },
        { id: 'very_sad', icon: CloudRain, label: t('home.moods.stormy'), color: 'text-gray-400', bg: 'bg-black/[0.02]', value: 1 },
    ];

    const [showWelcome, setShowWelcome] = useState(false);
    const { playTrack, pause, currentTrack } = useSound();

    useEffect(() => {
        // Play audio immediately
        playTrack('piano');

        // Show Welcome Note at 3 seconds
        const welcomeTimer = setTimeout(() => {
            setShowWelcome(true);
        }, 3000);

        // Stop Audio at 20 seconds
        const audioTimer = setTimeout(() => {
            pause();
        }, 20000);

        return () => {
            clearTimeout(welcomeTimer);
            clearTimeout(audioTimer);
            pause(); // Cleanup audio on unmount
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Logs
                const response = await api.get('/mood/logs');
                setMoodHistory(response.data);
                const today = new Date().toISOString().split('T')[0];
                const todayEntry = response.data.find(m => new Date(m.createdAt).toISOString().split('T')[0] === today);
                if (todayEntry) setSelectedMood(todayEntry.emoji);

                // Fetch Quote
                const quoteRes = await api.get('/health/daily-quote');
                if (quoteRes.data.quote) setQuote(quoteRes.data.quote);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleMoodSelect = async (moodId) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const moodObj = moods.find(m => m.id === moodId);
            await api.post('/mood/log', { emoji: moodId, label: moodObj.label, note: "" });
            toast.success("Reflection registered. The sanctuary remembers.");

            // Refresh logs immediately to update graph
            const response = await api.get('/mood/logs');
            setMoodHistory(response.data);
            setSelectedMood(moodId);
        } catch (error) {
            console.error("Mood logging error:", error);
            const message = error.response?.data?.message || "Reflection lost in the breeze.";
            toast.error(message);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const actions = [
        { title: t('home.actions.chat.title'), desc: t('home.actions.chat.desc'), icon: MessageCircle, path: '/chat', color: 'bg-morning-accent-teal/10 text-morning-accent-teal', delay: 0.1 },
        { title: t('home.actions.booking.title'), desc: t('home.actions.booking.desc'), icon: Calendar, path: '/booking', color: 'bg-morning-accent-lavender/10 text-morning-accent-lavender', delay: 0.2 },
        { title: t('home.actions.forum.title'), desc: t('home.actions.forum.desc'), icon: Users, path: '/forum', color: 'bg-morning-accent-rose/10 text-morning-accent-rose', delay: 0.3 },
        { title: t('home.actions.resources.title'), desc: t('home.actions.resources.desc'), icon: BookOpen, path: '/resources', color: 'bg-morning-accent-amber/10 text-morning-accent-amber', delay: 0.4 },
        { title: t('home.actions.screening.title'), desc: t('home.actions.screening.desc'), icon: ClipboardCheck, path: '/screening', color: 'bg-black/[0.02] text-gray-400', delay: 0.5 },
    ];

    const chartData = [...moodHistory].reverse().map(m => {
        const moodObj = moods.find(mood => mood.id === m.emoji || mood.label === m.label);
        return {
            date: new Date(m.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            value: moodObj ? moodObj.value : 3,
        };
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader className="animate-spin text-morning-accent-lavender" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Illuminating the path...</p>
        </div>
    );

    return (
        <div className="space-y-16 pb-20 relative">
            {/* Welcome Overlay (Appears after 3s) */}
            {/* Welcome Overlay (Appears after 3s) */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-md"
                        onClick={() => setShowWelcome(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl w-[90%] text-center border border-morning-accent-lavender/20 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-morning-accent-teal via-morning-accent-lavender to-morning-accent-rose animate-gradient-x" />

                            <div className="relative mb-6 inline-block">
                                {/* The Girl Image (Swaying) */}
                                <motion.img
                                    src={welcomeGirlV2}
                                    alt="Welcome"
                                    className="w-56 h-56 mx-auto object-contain relative z-10"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        rotate: [-2, 2, -2]
                                    }}
                                    transition={{
                                        y: { duration: 0.5 },
                                        opacity: { duration: 0.5 },
                                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                />

                                {/* Falling Flowers Emitter (From the basket/hand area) */}
                                <div className="absolute top-[40%] right-[10%] w-10 h-10 z-20 pointer-events-none">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                            animate={{
                                                x: [0, 20 + Math.random() * 60],
                                                y: [0, 100 + Math.random() * 100],
                                                opacity: [1, 1, 0],
                                                scale: [0.5, 1, 0.5],
                                                rotate: [0, 180, 360]
                                            }}
                                            transition={{
                                                duration: 2 + Math.random(),
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                                ease: "easeOut"
                                            }}
                                            className="absolute"
                                        >
                                            <Sparkles
                                                size={8 + Math.random() * 8}
                                                className={`text-morning-accent-${['rose', 'lavender', 'amber', 'teal'][Math.floor(Math.random() * 4)]}`}
                                                fill="currentColor"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight"
                            >
                                Welcome Home, <span className="text-morning-accent-lavender">{user?.name?.split(' ')[0]}</span>
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="relative py-4 px-8"
                            >
                                <Users size={24} className="absolute top-0 left-4 text-morning-accent-teal/20 rotate-12" />
                                <BookOpen size={24} className="absolute bottom-0 right-4 text-morning-accent-rose/20 -rotate-12" />
                                <p className="text-lg md:text-xl text-gray-500 font-medium italic leading-relaxed">
                                    "{quote || t('home.quoteFallback')}"
                                </p>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                onClick={() => setShowWelcome(false)}
                                className="mt-8 px-12 py-4 bg-gradient-to-r from-morning-accent-lavender to-morning-accent-teal text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg tracking-wide"
                            >
                                Enter Sanctuary
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <header className="relative py-16 px-6 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-morning-accent-lavender/5 text-morning-accent-lavender text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-black/5">
                        {t('home.sereneMorning')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tighter">
                        {t('home.namaste')}, <span className="text-morning-accent-lavender glow-text">{user?.name?.split(' ')[0] || 'Seeker'}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t('home.welcomeMessage')}
                    </p>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[150%] bg-morning-accent-lavender/5 rounded-full blur-[140px] -z-10" />
            </header>

            {/* Breathing Space Section */}
            <section className="max-w-4xl mx-auto px-4">
                <motion.div
                    className="glass-card p-12 text-center relative overflow-hidden group border-black/5 shadow-glass-light"
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                        <Sun size={140} className="text-morning-accent-lavender" />
                    </div>

                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12">{t('home.morningBreath')}</h2>

                    <div className="relative flex items-center justify-center h-72">
                        <motion.div
                            animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.05, 0.1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-48 h-48 bg-morning-accent-lavender rounded-full blur-[60px]"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="w-40 h-40 rounded-full border border-black/5 flex items-center justify-center relative z-10"
                        >
                            <motion.div
                                animate={{ scale: [0.85, 1.25, 0.85] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="w-32 h-32 rounded-full bg-white/60 border border-black/5 shadow-glass-light flex items-center justify-center text-morning-accent-lavender font-black text-[10px] uppercase tracking-widest"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key="breath-text"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 10, repeat: Infinity, times: [0, 0.5, 1] }}
                                    >
                                        {t('home.breatheIn')}
                                    </motion.span>
                                </AnimatePresence>
                                <motion.span
                                    className="absolute"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, delay: 5, times: [0, 0.5, 1] }}
                                >
                                    {t('home.breatheOut')}
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    </div>

                    <p className="mt-12 text-gray-400 font-medium italic text-sm">
                        "In the dawn, your breath is the bridge to your clarity."
                    </p>
                </motion.div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl mx-auto px-6">
                <div className="lg:col-span-8 space-y-10">
                    {/* Mood Tracker */}
                    <div className="glass-card p-10 bg-white/40 shadow-glass-light transition-all duration-500">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-morning-accent-lavender/10 text-morning-accent-lavender rounded-2xl flex items-center justify-center shadow-sm">
                                <Wind size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{t('home.emotionalTides')}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{t('home.registry')}</p>
                            </div>
                        </div>

                        {/* Sound Preview Tester (Hidden as per request) */}
                        {/* <div className="mb-14 p-8 glass-panel border border-morning-accent-lavender/30 rounded-[2.5rem] relative overflow-hidden bg-white/40">
                             ... (hidden)
                        </div> */}

                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {moods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleMoodSelect(m.id)}
                                    disabled={submitting}
                                    className={`flex flex-col items-center group transition-all duration-1000 ${selectedMood === m.id ? 'scale-110' : 'opacity-30 hover:opacity-100 hover:scale-105'} ${submitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                >
                                    <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-glass-light border border-black/[0.02] transition-all duration-1000 ${selectedMood === m.id ? 'bg-black/5 border-morning-accent-lavender/30 ring-4 ring-morning-accent-lavender/5' : 'bg-black/[0.02] hover:bg-black/5'}`}>
                                        <m.icon size={32} className={m.color} />
                                    </div>
                                    <span className={`mt-4 text-[9px] font-black uppercase tracking-[0.2em] ${selectedMood === m.id ? 'text-morning-accent-lavender' : 'text-gray-400'}`}>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {actions.slice(0, 4).map((action) => (
                            <motion.div
                                key={action.title}
                                whileHover={{ y: -5, scale: 1.02 }}
                                onClick={() => navigate(action.path)}
                                className="glass-card p-8 flex items-start gap-6 cursor-pointer group bg-white/40 shadow-glass-light border-black/5"
                            >
                                <div className={`w-16 h-16 shrink-0 rounded-[1.8rem] flex items-center justify-center shadow-glass-light transition-all duration-1000 group-hover:scale-110 border border-black/5 ${action.color}`}>
                                    <action.icon size={28} />
                                </div>
                                <div className="pt-2">
                                    <h4 className="font-bold text-gray-800 group-hover:text-morning-accent-lavender transition-colors">{action.title}</h4>
                                    <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">{action.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Insights Small Card */}
                    {moodHistory.length > 1 ? (
                        <div className="glass-card p-8 bg-white/40 shadow-glass-light border-black/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                                <TrendingUp size={14} className="text-morning-accent-teal" /> Reflection Path
                            </h3>
                            <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#9B8CE6"
                                            strokeWidth={4}
                                            dot={false}
                                            animationDuration={3000}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-8 bg-white/40 shadow-glass-light border-black/5 text-center">
                            <History size={32} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('home.historyForming')}</p>
                        </div>
                    )}

                    {/* Thought of the Morning */}
                    <div className="glass-card p-10 bg-gradient-to-br from-morning-header to-white relative overflow-hidden group border-black/5 shadow-glass-light">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <motion.div
                                animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.2, 1] }}
                                transition={{ duration: 10, repeat: Infinity }}
                                className="absolute top-[-20%] right-[-20%] w-72 h-72 bg-morning-accent-lavender rounded-full blur-[90px]"
                            />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-gray-400">{t('home.morningBreeze')}</h4>
                        <p className="text-xl font-bold leading-relaxed italic text-gray-700 glow-text min-h-[4rem]">
                            "{quote || "Even in the quietest morning, the sanctuary remains alive and fresh."}"
                        </p>
                        <div className="mt-10 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border border-black/5 bg-morning-base" />
                                ))}
                            </div>
                            <span className="text-[8px] font-black text-morning-accent-lavender uppercase tracking-[0.3em]">AI Wisdom</span>
                        </div>
                    </div>

                    {/* Emergency shortcut */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate('/crisis')}
                        className="w-full glass-card p-6 flex items-center justify-center gap-4 text-status-danger font-black uppercase tracking-[0.3em] text-[10px] hover:bg-status-danger/10 border-morning-accent-rose/20 transition-all duration-1000 shadow-xl shadow-status-danger/5"
                    >
                        <ShieldAlert size={18} className="animate-pulse" />
                        <span>{t('home.signalCrisis')}</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Home;
