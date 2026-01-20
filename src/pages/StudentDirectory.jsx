import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Activity, MessageSquare, ShieldCheck, Heart, Sparkles, Smile, Meh, Frown, CloudRain, User as UserIcon, Loader, FileText, Plus, Save } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentData, setStudentData] = useState({ screenings: [], moods: [], chatLogs: [], notes: [] });
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    const moodIcons = {
        very_happy: Sparkles,
        happy: Smile,
        neutral: Meh,
        sad: Frown,
        very_sad: CloudRain
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/admin/students');
                setStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students", error);
                toast.error("Failed to load directory");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const fetchStudentDetails = async (studentId) => {
        setLoadingDetails(true);
        setSelectedStudent(students.find(s => s._id === studentId));
        try {
            const [scr, mds, logs, notesRes] = await Promise.all([
                api.get(`/admin/students/${studentId}/screenings`),
                api.get(`/admin/students/${studentId}/moods`),
                api.get(`/admin/students/${studentId}/chatlogs`),
                api.get(`/counselor/notes/${studentId}`)
            ]);
            setStudentData({ screenings: scr.data, moods: mds.data, chatLogs: logs.data, notes: notesRes.data });
        } catch (error) {
            toast.error("Failed to fetch student details");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSaveNote = async () => {
        if (!newNote.trim()) return;
        setSavingNote(true);
        try {
            const res = await api.post('/counselor/notes', {
                studentId: selectedStudent._id,
                note: newNote,
                tags: ['General'] // Default tag for now
            });
            setStudentData(prev => ({ ...prev, notes: [res.data, ...prev.notes] }));
            setNewNote('');
            toast.success("Note saved securely");
        } catch (error) {
            toast.error("Failed to save note");
        } finally {
            setSavingNote(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <Loader className="animate-spin text-morning-accent-teal" size={40} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Directory...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Seeker <span className="text-morning-accent-teal">Directory</span></h1>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Full detailed records of all registered seekers</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Student Directory List */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-4 glass-card overflow-hidden h-fit bg-white/40 border-black/5 shadow-glass-light"
                >
                    <div className="p-6 border-b border-gray-50 bg-white/40 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gray-400">
                            <Users size={14} /> Registered Seekers
                        </h3>
                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-full shadow-sm">{students.length}</span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[700px] overflow-y-auto no-scrollbar">
                        {students.map(s => (
                            <button
                                key={s._id}
                                onClick={() => fetchStudentDetails(s._id)}
                                className={`w-full text-left p-6 transition-all duration-700 flex items-center gap-4 ${selectedStudent?._id === s._id ? 'bg-morning-accent-teal/5 border-r-4 border-morning-accent-teal' : 'hover:bg-white/60'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedStudent?._id === s._id ? 'bg-morning-accent-teal text-white shadow-glass-light' : 'bg-white shadow-glass-light text-gray-300 border border-black/5'}`}>
                                    {s.name ? s.name.charAt(0) : (s.anonymousId?.charAt(3) || 'S')}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{s.name || s.anonymousId}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Student Details View */}
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
                                {loadingDetails ? (
                                    <div className="flex flex-col items-center justify-center p-32 space-y-4">
                                        <Loader className="animate-spin text-morning-accent-teal" size={32} />
                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Accessing Secure Path...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{selectedStudent.name || selectedStudent.anonymousId}</h3>
                                                    <ShieldCheck className="text-morning-accent-teal" size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-bold text-morning-accent-teal uppercase tracking-[0.3em]">{selectedStudent.college || 'Universal Campus'}</p>
                                                    <p className="text-sm font-medium text-gray-500 mt-1 tracking-wide">{selectedStudent.email}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/60 px-6 py-4 rounded-[1.8rem] border border-black/5 shadow-glass-light">
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Resilience Streak</p>
                                                <p className="text-2xl font-black text-morning-accent-rose">🔥 {selectedStudent.streak || 0} <span className="text-[10px] uppercase tracking-widest ml-1 opacity-50 font-bold">Days</span></p>
                                            </div>
                                        </div>

                                        <div className="grid gap-12">
                                            {/* Clinical Notes Section */}
                                            <div className="bg-white/40 p-6 rounded-[2rem] border border-black/5 shadow-glass-light">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                                                    <FileText size={14} className="text-morning-accent-lavender" />
                                                    Clinical Notes (Private)
                                                </h4>

                                                <div className="mb-6">
                                                    <textarea
                                                        placeholder="Write a private observation..."
                                                        className="w-full p-4 rounded-2xl bg-white/60 border border-black/5 text-sm font-medium focus:ring-2 focus:ring-morning-accent-lavender/20 outline-none resize-none h-24"
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                    />
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            onClick={handleSaveNote}
                                                            disabled={!newNote.trim() || savingNote}
                                                            className="btn-primary py-2 px-4 flex items-center gap-2 text-[10px]"
                                                        >
                                                            {savingNote ? <Loader className="animate-spin" size={14} /> : <Save size={14} />}
                                                            Save Securely
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                                                    {studentData.notes && studentData.notes.length > 0 ? studentData.notes.map(note => (
                                                        <div key={note._id} className="p-4 bg-white/60 rounded-2xl border border-black/5">
                                                            <p className="text-sm text-gray-700 leading-relaxed mb-2">{note.note}</p>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                                    {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-morning-accent-lavender uppercase tracking-widest">
                                                                    By: {note.counselorId?.name || 'Counselor'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <p className="text-center text-xs text-gray-400 italic">No notes recorded yet.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mood History */}
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                                                    <Activity size={14} className="text-morning-accent-rose" />
                                                    Reflection History
                                                </h4>
                                                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                                    {studentData.moods.length > 0 ? studentData.moods.map((m, i) => {
                                                        const Icon = moodIcons[m.emoji] || Sparkles;
                                                        return (
                                                            <div key={m._id} className="min-w-[140px] glass-card p-6 text-center border-black/5 bg-white/60 shadow-glass-light">
                                                                <div className="flex justify-center mb-3">
                                                                    <div className="p-2 bg-morning-accent-lavender/10 rounded-xl text-morning-accent-lavender">
                                                                        <Icon size={24} />
                                                                    </div>
                                                                </div>
                                                                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1">{m.label}</p>
                                                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{format(new Date(m.createdAt), 'MMM d')}</p>
                                                            </div>
                                                        );
                                                    }) : <p className="text-sm text-gray-300 font-medium italic">Silence in the journey.</p>}
                                                </div>
                                            </div>

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
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Seeker Profile</h4>
                                <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                                    Select a seeker from the directory to view their complete wellness journey, resilience logs, and assessment history.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudentDirectory;
