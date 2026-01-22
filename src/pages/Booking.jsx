import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle, ChevronRight, Star, Loader, Heart, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Booking = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const res = await api.get('/auth/counselors');
                setCounselors(res.data);
            } catch (err) {
                console.error("Failed to fetch counselors", err);
                toast.error("Unable to load counselor list");
            } finally {
                setFetchLoading(false);
            }
        };
        fetchCounselors();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/appointments', {
                counselorId: selectedCounselor._id,
                date: `${selectedDate} ${selectedTime}`
            });

            setSuccess(true);
            toast.success("Session booked successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto py-20 px-6">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-status-success/10 text-status-success rounded-[2rem] flex items-center justify-center mb-8 shadow-glass-light"
                >
                    <CheckCircle size={48} />
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">{t('booking.successTitle')}</h2>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                    {t('booking.successMsg')}
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => window.location.href = '/'}
                    className="mt-12 btn-primary px-10 py-4"
                >
                    {t('booking.returnHome')}
                </motion.button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <header className="relative py-12 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-morning-accent-lavender/10 text-morning-accent-lavender text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        {t('booking.headerTag')}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
                        {t('booking.headerTitle')} <span className="text-morning-accent-lavender">{t('booking.headerTitleHighlight')}</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
                        {t('booking.headerDesc')}
                    </p>
                </motion.div>
            </header>

            {fetchLoading ? (
                <div className="flex justify-center p-20">
                    <Loader className="animate-spin text-morning-accent-lavender" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
                    {/* Steps Indicator */}
                    <aside className="lg:col-span-4">
                        <div className="glass-card p-8 sticky top-24 bg-white/40 border-black/5 shadow-glass-light">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Clarity Path</h3>
                            <div className="space-y-10 relative">
                                {/* Vertical Line Connection */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-50 -z-10" />

                                {[
                                    { step: 1, label: t('booking.steps.1.label'), sub: t('booking.steps.1.sub') },
                                    { step: 2, label: t('booking.steps.2.label'), sub: t('booking.steps.2.sub') },
                                    { step: 3, label: t('booking.steps.3.label'), sub: t('booking.steps.3.sub') }
                                ].map((s) => (
                                    <div key={s.step} className="flex gap-6 relative">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-700 shadow-glass-light ${step >= s.step ? 'bg-gray-800 text-white scale-110' : 'bg-white text-gray-300 border border-gray-100'}`}>
                                            {step > s.step ? <CheckCircle size={14} /> : s.step}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold uppercase tracking-widest ${step >= s.step ? 'text-gray-800' : 'text-gray-300'}`}>
                                                {s.label}
                                            </h4>
                                            <p className={`text-[10px] font-medium transition-opacity duration-700 ${step >= s.step ? 'opacity-100 text-gray-500' : 'opacity-0 text-gray-400'}`}>
                                                {s.sub}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 rounded-[1.5rem] bg-morning-accent-teal/5 border border-morning-accent-teal/10 flex items-start gap-3">
                                <ShieldCheck size={18} className="text-morning-accent-teal shrink-0" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    {t('booking.privacyNote')}
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Form Area */}
                    <main className="lg:col-span-8">
                        <form onSubmit={handleBooking} className="glass-card p-8 md:p-12 min-h-[500px] flex flex-col bg-white/40 border-black/5 shadow-glass-light">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1"
                                    >
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 bg-morning-accent-lavender/10 text-morning-accent-lavender rounded-xl flex items-center justify-center">
                                                <Heart size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">{t('booking.selectGuide')}</h3>
                                        </div>

                                        {counselors.length === 0 ? (
                                            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
                                                <p className="text-gray-400 font-medium italic">{t('booking.noGuides')}</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {counselors.map((c) => (
                                                    <motion.div
                                                        key={c._id}
                                                        whileHover={{ x: 5 }}
                                                        onClick={() => setSelectedCounselor(c)}
                                                        className={`p-6 rounded-[2rem] border transition-all duration-700 flex items-center gap-6 cursor-pointer ${selectedCounselor?._id === c._id ? 'bg-white border-morning-accent-lavender/30 shadow-glass-light ring-1 ring-morning-accent-lavender/10' : 'bg-white/50 border-gray-100 hover:border-morning-accent-lavender/10 hover:bg-white'}`}
                                                    >
                                                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${selectedCounselor?._id === c._id ? 'bg-morning-accent-lavender text-white rotate-6' : 'bg-gray-50 text-gray-300'}`}>
                                                            <User size={32} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-gray-800">{c.anonymousId}</h4>
                                                                <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase tracking-[0.2em] rounded-full text-gray-400">Verified</span>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.college || 'Counselling Department'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center text-morning-accent-amber font-bold text-xs mb-1">
                                                                <Star size={14} className="fill-current mr-1" /> 4.9
                                                            </div>
                                                            <p className="text-[10px] text-morning-accent-teal font-bold uppercase tracking-widest">Available Now</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                disabled={!selectedCounselor}
                                                className="btn-primary px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20"
                                            >
                                                {t('booking.next')} <ChevronRight size={16} className="ml-2 inline" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1"
                                    >
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="w-10 h-10 bg-morning-accent-teal/10 text-morning-accent-teal rounded-xl flex items-center justify-center">
                                                <Calendar size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">{t('booking.findMoment')}</h3>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-2">{t('booking.selectDate')}</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-morning-accent-teal transition-colors" size={18} />
                                                    <input
                                                        type="date"
                                                        required
                                                        className="input-field pl-14 py-4 bg-white/60 focus:bg-white border-black/5"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] pl-2">{t('booking.availableSlots')}</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`py-4 px-4 text-xs font-bold rounded-[1.5rem] border transition-all duration-700 ${selectedTime === time ? 'bg-gray-800 text-white border-gray-800 shadow-glass-light scale-105' : 'bg-white/50 border-gray-100 text-gray-400 hover:border-morning-accent-lavender/20 hover:text-gray-800 hover:bg-white'}`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                                            <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-gray-800 transition-colors">{t('booking.back')}</button>
                                            <button
                                                type="button"
                                                onClick={() => setStep(3)}
                                                disabled={!selectedDate || !selectedTime}
                                                className="btn-primary px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-20"
                                            >
                                                {t('booking.next')} <ChevronRight size={16} className="ml-2 inline" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1"
                                    >
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="w-10 h-10 bg-morning-accent-lavender/20 text-morning-accent-lavender rounded-xl flex items-center justify-center">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">{t('booking.confirmTitle')}</h3>
                                        </div>

                                        <div className="p-10 rounded-[2.5rem] bg-white/60 border border-black/5 shadow-inner space-y-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{t('booking.selectedGuide')}</span>
                                                <span className="text-xl font-bold text-gray-800">{selectedCounselor?.anonymousId}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{t('booking.scheduledDate')}</span>
                                                <span className="text-xl font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{t('booking.sessionTime')}</span>
                                                <span className="text-xl font-bold text-morning-accent-lavender">{selectedTime}</span>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                                            <button type="button" onClick={() => setStep(2)} className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-gray-800 transition-colors">{t('booking.back')}</button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary px-12 py-4 text-xs font-bold uppercase tracking-[0.2em]"
                                            >
                                                {loading ? <Loader className="animate-spin" size={18} /> : t('booking.submit')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </main>
                </div>
            )}
        </div>
    );
};

export default Booking;
