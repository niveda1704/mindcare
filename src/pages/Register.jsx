import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, School, Shield, Loader, CheckCircle, ArrowRight, Heart, Sun, Sparkles, User } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        rollNumber: '',
        consent: false
    });
    const [loading, setLoading] = useState(false);
    const [generatedId, setGeneratedId] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const anonID = `MC-${Math.floor(Math.random() * 1000000)}`;
        setGeneratedId(anonID);

        try {
            await register(formData);
            setTimeout(() => navigate('/select-role'), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <NatureBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl z-10"
            >
                <div className="glass-card p-10 md:p-14 relative overflow-hidden bg-white/40 border-black/5 shadow-glass-light">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-morning-accent-lavender/5 rounded-full blur-[100px] -mr-24 -mt-24" />

                    <div className="text-center mb-12">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-16 h-16 bg-white/60 border border-black/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-morning-accent-lavender shadow-glass-light"
                        >
                            <Sun size={32} />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tighter">Begin Your <span className="text-morning-accent-lavender">Chronicle</span></h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Connect to your path with absolute privacy</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!generatedId ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 1 }}
                                onSubmit={handleRegister}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="input-field pl-16 text-base"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Sanctuary Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="input-field pl-16 text-base"
                                                placeholder="univ@email.edu"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Secret Phrase</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="password"
                                                required
                                                className="input-field pl-16 text-base"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Institution</label>
                                        <div className="relative group">
                                            <School className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="input-field pl-16 text-base"
                                                placeholder="NIT, IIT, etc."
                                                value={formData.college}
                                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Identity Marker</label>
                                        <div className="relative group">
                                            <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="input-field pl-16 text-base"
                                                placeholder="e.g. 21BCE01"
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-black/[0.02] border border-black/5 shadow-inner">
                                    <div className="relative flex items-center h-5">
                                        <input
                                            id="consent"
                                            type="checkbox"
                                            required
                                            className="w-5 h-5 rounded-lg text-morning-accent-lavender focus:ring-morning-accent-lavender/20 border-black/10 bg-white/40"
                                            checked={formData.consent}
                                            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                        />
                                    </div>
                                    <label htmlFor="consent" className="text-xs text-gray-500 font-medium leading-relaxed">
                                        I recognize that my journey is private. I commit to the <a href="#" className="font-bold text-gray-700 border-b border-black/5 hover:text-gray-900 transition-colors">Soulful Privacy Guidelines</a>.
                                    </label>
                                </div>

                                <button type="submit" className="w-full btn-primary py-5 text-base shadow-glass-light" disabled={loading}>
                                    {loading ? <Loader className="animate-spin mx-auto text-white" /> : 'Establish Safe Account'}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="text-center py-8"
                            >
                                <div className="w-24 h-24 bg-morning-accent-teal/10 border border-morning-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(111,205,193,0.1)]">
                                    <CheckCircle className="text-morning-accent-teal" size={48} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-3 tracking-tighter">Identity Manifested</h3>
                                <p className="text-[10px] font-black text-gray-400 mb-10 uppercase tracking-[0.4em]">Your morning marker has been set</p>

                                <div className="p-10 rounded-[2.5rem] bg-white/60 border border-black/5 shadow-glass-light relative group">
                                    <div className="absolute inset-0 bg-morning-accent-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl rounded-full" />
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 relative z-10">MindCare Sanctuary ID</p>
                                    <div className="text-4xl font-bold text-morning-accent-lavender tracking-[0.2em] font-mono select-all relative z-10 glow-text">
                                        {generatedId}
                                    </div>
                                </div>

                                <div className="mt-14 flex flex-col items-center gap-4 text-morning-accent-teal font-black text-[10px] uppercase tracking-[0.5em]">
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-morning-accent-teal rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-morning-accent-teal rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-morning-accent-teal rounded-full animate-bounce" />
                                    </div>
                                    <span>Syncing with the Sanctuary...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-14 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Already have an account? <Link to="/login" className="text-morning-accent-lavender hover:text-morning-sage transition-colors ml-1">Enter Sanctuary</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
