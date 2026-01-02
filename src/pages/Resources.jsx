import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Headphones, Video, FileText, Search, Tag, Globe, ExternalLink, Sparkles, Filter, Loader, Moon, Wind, Sun } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                setResources(response.data);
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const categories = ['All', 'Anxiety', 'Stress', 'Sleep', 'Academic', 'Social', 'Meditation'];

    const filteredResources = resources.filter(r => {
        const rCat = r.category || 'General';
        const rTitle = r.title || '';
        const matchesFilter = filter === 'All' || rCat === filter;
        const matchesSearch = rTitle.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'video': return Video;
            case 'audio': return Headphones;
            default: return FileText;
        }
    };

    const getColors = (category) => {
        switch (category) {
            case 'Anxiety': return { bg: 'bg-morning-accent-teal/10', text: 'text-morning-accent-teal', border: 'border-morning-accent-teal/20' };
            case 'Stress': return { bg: 'bg-morning-accent-rose/10', text: 'text-morning-accent-rose', border: 'border-morning-accent-rose/20' };
            case 'Sleep': return { bg: 'bg-morning-accent-lavender/10', text: 'text-morning-accent-lavender', border: 'border-morning-accent-lavender/20' };
            case 'Academic': return { bg: 'bg-morning-accent-amber/10', text: 'text-morning-accent-amber', border: 'border-morning-accent-amber/20' };
            default: return { bg: 'bg-black/[0.02]', text: 'text-gray-400', border: 'border-black/5' };
        }
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <header className="relative py-16 px-6 overflow-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-morning-accent-lavender/5 text-morning-accent-lavender text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-black/5">
                        Morning Library
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 tracking-tighter">
                        Wisdom <span className="text-morning-accent-lavender glow-text">Sanctuary</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        A peaceful grove of curated guides, sounds, and ancestral wisdom to nourish your spirit during the fresh hours.
                    </p>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] bg-morning-accent-lavender/5 rounded-full blur-[140px] -z-10" />
            </header>

            {/* Controls Section */}
            <div className="glass-card p-8 flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/40 border-black/5 shadow-glass-light">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar w-full lg:w-auto">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-1000 whitespace-nowrap border ${filter === c
                                ? 'bg-black/5 text-gray-900 border-black/10 shadow-[0_0_20px_rgba(0,0,0,0.05)]'
                                : 'bg-black/[0.02] text-gray-400 hover:text-gray-700 border-black/5'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Seek inner peace..."
                        className="input-field pl-16 py-5 bg-white/60 focus:bg-white/80 text-base shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <Loader className="animate-spin text-morning-accent-lavender" size={48} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Illuminating the scrolls...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredResources.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-32 text-center"
                            >
                                <Wind size={40} className="mx-auto text-gray-400 mb-6" />
                                <p className="text-gray-400 font-medium italic text-lg tracking-wide">The breeze blows through an empty space. Try another path.</p>
                            </motion.div>
                        ) : (
                            filteredResources.map((resource, idx) => {
                                const Icon = getIcon(resource.type);
                                const colors = getColors(resource.category);

                                return (
                                    <motion.div
                                        key={resource._id || idx}
                                        layout
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="glass-card flex flex-col group overflow-hidden bg-white/60 border-black/5 hover:border-black/10 hover:bg-white/80 transition-all duration-1000 shadow-glass-light"
                                    >
                                        {/* Preview Area */}
                                        <div className="relative h-56 overflow-hidden rounded-[2.2rem] m-3 shadow-glass-light">
                                            {resource.type === 'video' && resource.url && resource.url.includes('embed') ? (
                                                <iframe
                                                    src={resource.url}
                                                    className="w-full h-full grayscale-[0.5] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                                                    title={resource.title}
                                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <div className={`w-full h-full ${colors.bg} flex items-center justify-center transition-transform duration-1000 group-hover:scale-110`}>
                                                    <Icon size={56} className={`${colors.text} opacity-20 group-hover:opacity-40 transition-opacity duration-1000`} />
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]" />
                                                </div>
                                            )}

                                            <div className="absolute top-5 left-5">
                                                <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] rounded-full backdrop-blur-xl border ${colors.text} ${colors.bg} ${colors.border} shadow-sm`}>
                                                    {resource.category || 'Deep Essence'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{resource.type}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                                <Sparkles size={12} className="text-morning-accent-amber opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight group-hover:text-morning-accent-lavender transition-colors duration-1000 line-clamp-2">
                                                {resource.title}
                                            </h3>
                                            <p className="text-base text-gray-500 font-medium mb-10 line-clamp-3 leading-relaxed">
                                                {resource.description || 'Gentle guidance and radiant wisdom curated for your fresh journey within.'}
                                            </p>

                                            <div className="mt-auto">
                                                <motion.a
                                                    href={resource.url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full py-5 rounded-[1.8rem] bg-black/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-black/5 group-hover:bg-morning-accent-lavender group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(155,140,230,0.15)] transition-all duration-1000"
                                                >
                                                    Illuminate <ExternalLink size={16} className="opacity-50" />
                                                </motion.a>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            )}

            <footer className="text-center pt-20 flex flex-col items-center gap-6">
                <Sun size={20} className="text-gray-300" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] select-none">
                    Breezes of knowledge added with every new dawn
                </p>
            </footer>
        </div>
    );
};

export default Resources;
