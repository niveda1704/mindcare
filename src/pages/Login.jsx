import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader, GraduationCap, Users, ShieldCheck, Fingerprint, Sun } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

const Login = () => {
    const { role } = useParams();
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await login(email, password, rollNumber);
            if (res.needsVerification) {
                setStep(2);
                toast('Reflection code sent to your inbox', { icon: '☀️' });
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const otpValue = otp.join('');
            if (otpValue.length !== 6) throw new Error('Complete the sequence');
            await verifyOtp(email, otpValue);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid sequence');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <NatureBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-card p-10 md:p-12 relative overflow-hidden bg-white/40 border-black/5 shadow-glass-light">
                    {/* Subtle Top Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-morning-accent-lavender/20 via-morning-accent-teal/20 to-morning-accent-amber/20" />

                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="bg-white/60 border border-black/5 shadow-glass-light w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 relative group"
                        >
                            <div className="absolute inset-0 bg-morning-accent-lavender/10 rounded-full blur-2xl group-hover:bg-morning-accent-lavender/20 transition-all duration-1000" />
                            {role === 'student' && <GraduationCap size={40} className="text-morning-accent-lavender relative z-10" />}
                            {role === 'counselor' && <Users size={40} className="text-morning-accent-teal relative z-10" />}
                            {role === 'admin' && <ShieldCheck size={40} className="text-gray-400 relative z-10" />}
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tighter">
                            MindCare <span className="text-morning-accent-lavender">{(role?.charAt(0) || '').toUpperCase() + (role?.slice(1) || '')}</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{step === 1 ? 'Enter the serene sanctuary' : 'Verify your reflection'}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.8 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field pl-14"
                                            placeholder="Identity / Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                        <input
                                            type="password"
                                            required
                                            className="input-field pl-14"
                                            placeholder="Secret Phrase"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    {role === 'student' && (
                                        <div className="relative group">
                                            <Fingerprint className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-morning-accent-lavender transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="input-field pl-14"
                                                placeholder="Roll Number"
                                                value={rollNumber}
                                                onChange={(e) => setRollNumber(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-status-danger text-[10px] font-black uppercase tracking-widest text-center bg-status-danger/5 py-4 rounded-3xl border border-status-danger/10"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button type="submit" className="w-full btn-primary py-5 shadow-inner" disabled={loading}>
                                    {loading ? <Loader className="animate-spin mx-auto" /> : 'Enter Sanctuary'}
                                </button>

                                <div className="text-center pt-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        First time here? <Link to="/register" className="text-morning-accent-lavender hover:text-morning-sage transition-colors ml-1">Begin Journey</Link>
                                    </p>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.8 }}
                                onSubmit={handleOtpVerification}
                                className="space-y-10"
                            >
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-8 leading-relaxed font-medium">The reflection code has been sent to <br /><span className="text-gray-800 font-bold">{email}</span></p>
                                    <div className="flex justify-between gap-3 px-2">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="w-12 h-16 text-center bg-white/60 border border-black/5 rounded-2xl focus:border-morning-accent-lavender focus:ring-8 focus:ring-morning-accent-lavender/5 focus:outline-none text-2xl font-black text-gray-800 transition-all duration-700 shadow-sm"
                                                value={data}
                                                onChange={e => handleOtpChange(e.target, index)}
                                                onFocus={e => e.target.select()}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {error && <p className="text-status-danger text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}

                                <button type="submit" className="w-full btn-primary py-5 bg-black/5 hover:bg-morning-accent-lavender/10 text-morning-accent-lavender border border-morning-accent-lavender/20" disabled={loading}>
                                    {loading ? <Loader className="animate-spin mx-auto" /> : 'Confirm Reflection'}
                                </button>

                                <div className="flex flex-col items-center gap-6 pt-6 border-t border-black/5">
                                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-morning-sage transition-colors">
                                        Back to Entrance
                                    </button>
                                    <Link to="/select-role" className="text-[8px] font-black text-morning-accent-lavender/50 uppercase tracking-[0.5em] hover:text-morning-accent-lavender">
                                        Change Perspective
                                    </Link>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Caption */}
                <div className="text-center mt-12 flex flex-col items-center gap-4">
                    <Sun size={16} className="text-gray-400 animate-pulse" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] select-none">
                        End-to-End Radiant Encryption
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
