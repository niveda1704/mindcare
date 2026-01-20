import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Loader, Plus, X, Clock, Save, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CounselorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState([]);
    const [savingSchedule, setSavingSchedule] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptsRes, availRes] = await Promise.all([
                    api.get('/appointments'),
                    api.get('/counselor/availability')
                ]);
                setAppointments(apptsRes.data.appointments);

                // Initialize availability if empty or merge with defaults
                const existingAvail = availRes.data || [];
                // Ensure all days are present for UI simplicity
                const mergedAvail = days.map(day => {
                    const found = existingAvail.find(a => a.day === day);
                    return found ? found : { day, slots: [] };
                });
                setAvailability(mergedAvail);

            } catch (error) {
                toast.error("Failed to load dashboard data");
                // Fallback for availability
                setAvailability(days.map(day => ({ day, slots: [] })));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleSlot = (dayIndex, slot) => {
        const newAvail = [...availability];
        const currentSlots = newAvail[dayIndex].slots;

        if (currentSlots.includes(slot)) {
            newAvail[dayIndex].slots = currentSlots.filter(s => s !== slot);
        } else {
            newAvail[dayIndex].slots = [...currentSlots, slot].sort();
        }
        setAvailability(newAvail);
    };

    const saveSchedule = async () => {
        setSavingSchedule(true);
        try {
            await api.post('/counselor/availability', { availability });
            toast.success("Schedule updated successfully");
        } catch (error) {
            toast.error("Failed to save schedule");
        } finally {
            setSavingSchedule(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <Loader className="animate-spin text-morning-accent-teal" size={40} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Synchronising Path...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Guidance <span className="text-morning-accent-teal">Portal</span></h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Professional Serenity Dashboard</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Appointments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 glass-card overflow-hidden bg-white/40 border-black/5 shadow-glass-light h-fit"
                >
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                <Calendar size={20} className="text-morning-accent-lavender" />
                                Upcoming Sessions
                            </h3>
                        </div>
                        <span className="bg-morning-accent-lavender/10 text-morning-accent-lavender text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-morning-accent-lavender/10">
                            {appointments.length} Total
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto no-scrollbar">
                        {appointments.length > 0 ? appointments.map((appt, idx) => (
                            <motion.div
                                key={appt._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/60 transition-all duration-700 group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white shadow-glass-light rounded-[1.5rem] flex items-center justify-center text-morning-accent-teal font-black text-xl group-hover:scale-110 transition-transform duration-700 border border-black/5">
                                        {appt.studentId?.name ? appt.studentId.name.charAt(0) : (appt.studentId?.anonymousId?.charAt(3) || 'S')}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-morning-accent-teal transition-colors duration-700">{appt.studentId?.name || appt.studentId?.anonymousId}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{appt.studentId?.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-gray-300 uppercase font-black tracking-widest">Scheduled For</p>
                                        <p className="text-sm font-bold text-gray-800">{appt.date}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] text-gray-300 uppercase font-black tracking-widest">Status</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${appt.status === 'confirmed' ? 'bg-morning-accent-teal/10 text-morning-accent-teal' : 'bg-morning-accent-amber/10 text-morning-accent-amber'}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-20 text-center">
                                <p className="text-gray-400 font-medium italic">The path is clear. No pending sessions.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Availability Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-5 glass-card overflow-hidden bg-white/40 border-black/5 shadow-glass-light h-fit"
                >
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/40">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            <Clock size={20} className="text-morning-accent-teal" />
                            My Availability
                        </h3>
                        <button
                            onClick={saveSchedule}
                            disabled={savingSchedule}
                            className="btn-primary py-2 px-4 flex items-center gap-2 text-[10px]"
                        >
                            {savingSchedule ? <Loader className="animate-spin" size={14} /> : <Save size={14} />}
                            {savingSchedule ? 'Saving' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="p-8 max-h-[600px] overflow-y-auto no-scrollbar space-y-8">
                        {availability.map((dayData, index) => (
                            <div key={dayData.day} className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{dayData.day}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {timeSlots.map(slot => {
                                        const isSelected = dayData.slots.includes(slot);
                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => toggleSlot(index, slot)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-300 border ${isSelected
                                                        ? 'bg-morning-accent-teal text-white border-transparent shadow-lg shadow-morning-accent-teal/20'
                                                        : 'bg-white/60 text-gray-400 border-black/5 hover:border-morning-accent-teal/30 hover:text-morning-accent-teal'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
