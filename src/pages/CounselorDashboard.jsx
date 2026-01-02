import React, { useState, useEffect } from 'react';
import { Calendar, Users, MessageSquare, Heart, Clock, Loader, ChevronRight, User as UserIcon, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CounselorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentData, setStudentData] = useState({ screenings: [], moods: [], chatLogs: [] });
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [tab, setTab] = useState('appointments');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apptsRes = await api.get('/appointments');
                const studentsRes = await api.get('/admin/students');
                setAppointments(apptsRes.data.appointments);
                setStudents(studentsRes.data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchStudentDetails = async (studentId) => {
        setDetailLoading(true);
        setSelectedStudent(students.find(s => s._id === studentId));
        try {
            const [screenings, moods, logs] = await Promise.all([
                api.get(`/admin/students/${studentId}/screenings`),
                api.get(`/admin/students/${studentId}/moods`),
                api.get(`/admin/students/${studentId}/chatlogs`)
            ]);
            setStudentData({
                screenings: screenings.data,
                moods: moods.data,
                chatLogs: logs.data
            });
            setTab('student-detail');
        } catch (error) {
            toast.error("Failed to fetch student records");
        } finally {
            setDetailLoading(false);
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
                <div className="flex glass-card p-1 bg-white/40 shadow-glass-light border-black/5">
                    <button
                        onClick={() => setTab('appointments')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${tab === 'appointments' ? 'bg-gray-800 text-white shadow-glass-light' : 'text-gray-400 hover:text-gray-800'}`}
                    >
                        Sessions
                    </button>
                    <button
                        onClick={() => setTab('students')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${tab === 'students' || tab === 'student-detail' ? 'bg-gray-800 text-white shadow-glass-light' : 'text-gray-400 hover:text-gray-800'}`}
                    >
                        Directory
                    </button>
                </div>
            </div>

            {tab === 'appointments' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden bg-white/40 border-black/5 shadow-glass-light"
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
                    <div className="divide-y divide-gray-50">
                        {appointments.length > 0 ? appointments.map((appt, idx) => (
                            <motion.div
                                key={appt._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/60 transition-all duration-700 group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white shadow-glass-light rounded-[1.5rem] flex items-center justify-center text-morning-accent-teal font-black text-xl group-hover:scale-110 transition-transform duration-700 border border-black/5">
                                        {appt.studentId?.anonymousId?.charAt(3) || 'S'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-morning-accent-teal transition-colors duration-700">{appt.studentId?.anonymousId}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{appt.studentId?.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-10">
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

                                    <button
                                        onClick={() => fetchStudentDetails(appt.studentId?._id)}
                                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-glass-light border border-black/5 text-gray-300 hover:text-gray-800 hover:scale-105 transition-all duration-700"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-20 text-center">
                                <p className="text-gray-400 font-medium italic">The path is clear. No pending sessions.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {(tab === 'students' || tab === 'student-detail') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 glass-card overflow-hidden h-fit bg-white/40 border-black/5 shadow-glass-light"
                    >
                        <div className="p-6 border-b border-gray-50 bg-white/40">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gray-400">
                                <Users size={14} /> Student Directory
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto no-scrollbar">
                            {students.map(s => (
                                <button
                                    key={s._id}
                                    onClick={() => fetchStudentDetails(s._id)}
                                    className={`w-full text-left p-6 transition-all duration-700 flex items-center gap-4 ${selectedStudent?._id === s._id ? 'bg-morning-accent-teal/5 border-r-4 border-morning-accent-teal' : 'hover:bg-white/60'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedStudent?._id === s._id ? 'bg-morning-accent-teal text-white shadow-glass-light' : 'bg-white shadow-glass-light text-gray-300 border border-black/5'}`}>
                                        {s.anonymousId?.charAt(3)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{s.anonymousId}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.email.split('@')[0]}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Details */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {selectedStudent ? (
                                <motion.div
                                    key={selectedStudent._id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="glass-card p-10 relative overflow-hidden h-full bg-white/40 border-black/5 shadow-glass-light"
                                >
                                    {detailLoading ? (
                                        <div className="flex flex-col items-center justify-center p-32 space-y-4">
                                            <Loader className="animate-spin text-morning-accent-teal" size={32} />
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Accessing Secure Path...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-10">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{selectedStudent.anonymousId}</h3>
                                                        <ShieldCheck className="text-morning-accent-teal" size={20} />
                                                    </div>
                                                    <p className="text-xs font-bold text-morning-accent-teal uppercase tracking-[0.3em]">{selectedStudent.college || 'Universal Campus'}</p>
                                                </div>
                                                <div className="bg-white/60 px-6 py-4 rounded-[1.8rem] border border-black/5 shadow-glass-light">
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Resilience Streak</p>
                                                    <p className="text-2xl font-black text-morning-accent-rose">🔥 {selectedStudent.streak || 0} <span className="text-[10px] uppercase tracking-widest ml-1 opacity-50 font-bold">Days</span></p>
                                                </div>
                                            </div>

                                            <div className="grid gap-12">
                                                {/* Mood History */}
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                                                        <Activity size={14} className="text-morning-accent-rose" />
                                                        Reflection History
                                                    </h4>
                                                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                                        {studentData.moods.length > 0 ? studentData.moods.map((m, i) => (
                                                            <motion.div
                                                                key={m._id}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="min-w-[140px] glass-card p-6 text-center border-black/5 bg-white/60 shadow-glass-light"
                                                            >
                                                                <span className="text-3xl mb-3 block transform hover:scale-125 transition-transform duration-500 cursor-default">{m.emoji}</span>
                                                                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1">{m.label}</p>
                                                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{format(new Date(m.createdAt), 'MMM d')}</p>
                                                            </motion.div>
                                                        )) : <p className="text-sm text-gray-300 font-medium italic">Silence in the journey.</p>}
                                                    </div>
                                                </div>

                                                {/* Analysis Section */}
                                                <div className="grid md:grid-cols-2 gap-10">
                                                    {/* Chat Analysis */}
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                                                            <MessageSquare size={14} className="text-morning-accent-teal" />
                                                            Reflective Analysis
                                                        </h4>
                                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
                                                            {studentData.chatLogs.length > 0 ? studentData.chatLogs.slice(0, 15).map((log, i) => (
                                                                <div key={log._id} className={`p-5 rounded-[1.8rem] border relative overflow-hidden shadow-inner ${log.sender === 'user' ? 'bg-white border-gray-100' : 'bg-morning-accent-teal/5 border-morning-accent-teal/10'}`}>
                                                                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{log.message}</p>
                                                                    <div className="flex justify-between items-center mt-3">
                                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">{log.sender}</span>
                                                                        {log.riskLevel && log.riskLevel !== 'none' && (
                                                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${log.riskLevel === 'high' ? 'bg-status-danger/10 text-status-danger' : 'bg-morning-accent-amber/10 text-morning-accent-amber'}`}>
                                                                                Level: {log.riskLevel}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )) : <p className="text-sm text-gray-300 italic">No whispered words found.</p>}
                                                        </div>
                                                    </div>

                                                    {/* Screening Results */}
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                                                            <ShieldCheck size={14} className="text-morning-accent-lavender" />
                                                            Assessment Log
                                                        </h4>
                                                        <div className="divide-y divide-gray-100 glass-card bg-white/20 overflow-hidden border-black/5 shadow-glass-light">
                                                            {studentData.screenings.length > 0 ? studentData.screenings.map(res => (
                                                                <div key={res._id} className="p-6 flex justify-between items-center hover:bg-white/50 transition-colors">
                                                                    <div>
                                                                        <p className="font-bold text-sm text-gray-800 mb-1">{res.type}</p>
                                                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{format(new Date(res.createdAt), 'MMM d, h:mm a')}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-base font-black text-gray-800">{res.score}</p>
                                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${res.riskLevel === 'high' ? 'bg-status-danger/10 text-status-danger' : 'bg-morning-accent-teal/10 text-morning-accent-teal'}`}>
                                                                            {res.riskLevel}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )) : <p className="p-10 text-center text-sm text-gray-300 italic">No formal assessments recorded.</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-card border-2 border-dashed border-gray-100 h-[600px] flex flex-col items-center justify-center text-center p-10 bg-white/20 shadow-glass-light"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-200">
                                        <Users size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Guide</h4>
                                    <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                                        Select a student from the directory to begin reviewing their wellness journey and reflection landscape.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CounselorDashboard;
