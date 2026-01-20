import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, Users, BookOpen, Smile, Frown, Meh, CloudRain, Sun, Moon, ClipboardCheck, TrendingUp, History, Loader, Sparkles, Wind, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
        { id: 'very_happy', icon: Sparkles, label: 'Radiant', color: 'text-morning-accent-amber', bg: 'bg-morning-accent-amber/10', value: 5 },
        { id: 'happy', icon: Smile, label: 'Peaceful', color: 'text-morning-accent-teal', bg: 'bg-morning-accent-teal/10', value: 4 },
        { id: 'neutral', icon: Meh, label: 'Steady', color: 'text-morning-accent-lavender', bg: 'bg-morning-accent-lavender/10', value: 3 },
        { id: 'sad', icon: Frown, label: 'Heavy', color: 'text-morning-accent-rose', bg: 'bg-morning-accent-rose/10', value: 2 },
        { id: 'very_sad', icon: CloudRain, label: 'Stormy', color: 'text-gray-400', bg: 'bg-black/[0.02]', value: 1 },
    ];

    const { play } = useSound();

    useEffect(() => {
        // Attempt to play music automatically when entering Home
        // Browser policy might block this if no interaction happened yet,
        // but since user clicked Login, it should work.
        play();
    }, [play]);

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
        { title: 'Breeze of AI', desc: 'Secure, anonymous thoughts', icon: MessageCircle, path: '/chat', color: 'bg-morning-accent-teal/10 text-morning-accent-teal', delay: 0.1 },
        { title: 'Seek Guidance', desc: 'Connect with a guide', icon: Calendar, path: '/booking', color: 'bg-morning-accent-lavender/10 text-morning-accent-lavender', delay: 0.2 },
        { title: 'The Shared Hill', desc: 'Anonymously connect', icon: Users, path: '/forum', color: 'bg-morning-accent-rose/10 text-morning-accent-rose', delay: 0.3 },
        { title: 'Morning Wisdom', desc: 'Guides for your journey', icon: BookOpen, path: '/resources', color: 'bg-morning-accent-amber/10 text-morning-accent-amber', delay: 0.4 },
        { title: 'Heart Registry', desc: 'PHQ-9 & GAD-7 Tools', icon: ClipboardCheck, path: '/screening', color: 'bg-black/[0.02] text-gray-400', delay: 0.5 },
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
            {/* Hero Section */}
            <header className="relative py-16 px-6 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-morning-accent-lavender/5 text-morning-accent-lavender text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-black/5">
                        Serene Morning
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tighter">
                        Namaste, <span className="text-morning-accent-lavender glow-text">{user?.name?.split(' ')[0] || 'Seeker'}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Welcome back to your serene sanctuary. The world is fresh here. Breathe, reflect, and find your center.
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

                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12">Morning Breath</h2>

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
                                        Breathe In
                                    </motion.span>
                                </AnimatePresence>
                                <motion.span
                                    className="absolute"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, delay: 5, times: [0, 0.5, 1] }}
                                >
                                    Breathe Out
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
                                <h3 className="text-xl font-bold text-gray-800">Emotional Tides</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Registry of your internal landscape</p>
                            </div>
                        </div>

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
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History is forming...</p>
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
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-gray-400">Morning Breeze</h4>
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
                        <span>Signal Crisis Expert</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Home;
