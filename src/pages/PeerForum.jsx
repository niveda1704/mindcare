import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Flag, ShieldCheck, Send, MoreHorizontal, Loader, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PeerForum = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/forum');
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Failed to fetch posts", error);
            toast.error("Unable to load community posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setSubmitting(true);
        try {
            const response = await api.post('/forum', {
                content: newPost
            });

            setPosts([response.data.post, ...posts]);
            setNewPost('');
            toast.success("Reflection shared with the morning breeze");
        } catch (error) {
            console.error("Post failed", error);
            toast.error("Failed to share reflection");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id) => {
        setPosts(posts.map(p => p._id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <header className="relative py-12 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-morning-accent-teal/10 text-morning-accent-teal text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        Indian Student Community
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
                        The Shared <span className="text-morning-accent-teal">Hill</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        A safe, anonymous space where shared experiences grow into collective strength.
                    </p>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[150%] bg-morning-accent-teal/5 rounded-full blur-[120px] -z-10" />
            </header>

            {/* Create Post Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-1 m-2 bg-white/40 border-black/5 shadow-glass-light"
            >
                <div className="bg-white/60 rounded-[2.5rem] p-8">
                    <form onSubmit={handlePost} className="space-y-6">
                        <div className="relative">
                            <textarea
                                className="w-full resize-none bg-white border border-gray-100 rounded-[2rem] p-8 text-sm md:text-base font-medium outline-none focus:ring-8 focus:ring-morning-accent-teal/5 focus:border-morning-accent-teal/20 transition-all duration-700 placeholder:text-gray-300 shadow-inner"
                                rows="4"
                                placeholder="Share your reflection with the path... (Anonymous)"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />
                            <div className="absolute bottom-6 right-8">
                                <Sparkles size={20} className="text-morning-accent-teal/20 group-focus-within:text-morning-accent-teal/50 transition-colors" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                <div className="w-6 h-6 rounded-full bg-morning-accent-teal/20 flex items-center justify-center">
                                    <UserIcon size={12} className="text-morning-accent-teal" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Author: <span className="text-gray-800 font-mono ml-1">{user?.anonymousId}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!newPost.trim() || submitting}
                                className="btn-primary py-4 px-10 flex items-center gap-3"
                            >
                                {submitting ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {submitting ? 'Sharing...' : 'Share Anonymously'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-100" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Community Voices</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-100" />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader className="animate-spin text-morning-accent-teal" size={40} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Gathering voices...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {posts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 text-gray-400 font-medium italic"
                                >
                                    The hill is quiet. Be the first to share a reflection.
                                </motion.div>
                            ) : posts.map((post, idx) => (
                                <motion.div
                                    key={post._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="glass-card p-1 group hover:p-1.5 transition-all duration-700 bg-white/40 border-black/5 shadow-glass-light"
                                >
                                    <div className="bg-white/60 rounded-[2.5rem] p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-bold text-lg transition-all duration-700 shadow-glass-light ${post.role === 'admin' || post.role === 'counselor' ? 'bg-gray-800 text-white' : 'bg-white text-gray-400 border border-gray-100 group-hover:bg-morning-accent-teal/10 group-hover:text-morning-accent-teal group-hover:border-morning-accent-teal/20'}`}>
                                                    {post.authorId?.anonymousId?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={`font-bold text-sm tracking-tight ${post.role === 'admin' || post.role === 'counselor' ? 'text-gray-800' : 'text-gray-800 group-hover:text-morning-accent-teal transition-colors duration-700'}`}>
                                                            {post.authorId?.anonymousId}
                                                        </span>
                                                        {(post.role === 'admin' || post.role === 'counselor') && (
                                                            <div className="px-2 py-0.5 bg-morning-accent-teal/10 rounded-full flex items-center gap-1">
                                                                <ShieldCheck size={10} className="text-morning-accent-teal" />
                                                                <span className="text-[8px] font-black uppercase text-morning-accent-teal tracking-widest">Verified Guide</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                            <button className="p-3 text-gray-300 hover:text-gray-800 hover:bg-white rounded-2xl transition-all shadow-glass-light opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        <p className="text-gray-700 mb-8 leading-relaxed text-base md:text-lg font-medium selection:bg-morning-accent-teal/20">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center gap-8 pt-6 border-t border-gray-100/50">
                                            <button
                                                onClick={() => handleLike(post._id)}
                                                className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-morning-accent-rose transition-all duration-700 group/btn"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${post.likes > 0 ? 'bg-morning-accent-rose/10 text-morning-accent-rose' : 'bg-gray-50 text-gray-400 group-hover/btn:bg-morning-accent-rose/10 group-hover/btn:text-morning-accent-rose'}`}>
                                                    <Heart size={18} className={post.likes > 0 ? "fill-current" : ""} />
                                                </div>
                                                <span>{post.likes || 0}</span>
                                            </button>

                                            <button className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-morning-accent-teal transition-all duration-700 group/btn">
                                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover/btn:bg-morning-accent-teal/10 group-hover/btn:text-morning-accent-teal transition-all">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <span>{post.replies?.length || 0} Replies</span>
                                            </button>

                                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-status-danger transition-all ml-auto group/btn">
                                                <Flag size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                <span className="hidden sm:inline">Report</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <footer className="text-center pt-8">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.5em] select-none opacity-50">
                    Shared with absolute anonymity and care
                </p>
            </footer>
        </div>
    );
};

export default PeerForum;
