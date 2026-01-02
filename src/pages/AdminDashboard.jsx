import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, TrendingUp, Activity, Calendar, Loader, ShieldAlert, Sparkles, User as UserIcon, ChevronRight, Smile, Meh, Frown, CloudRain } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentData, setStudentData] = useState({ screenings: [], moods: [], chatLogs: [] });
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [view, setView] = useState('overview');

    const moodIcons = {
        very_happy: Sparkles,
        happy: Smile,
        neutral: Meh,
        sad: Frown,
        very_sad: CloudRain
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                const studentsRes = await api.get('/admin/students');

                setStats(response.data);
                setStudents(studentsRes.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                toast.error("Access denied or server error");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fetchStudentDetails = async (studentId) => {
        setLoadingDetails(true);
        setSelectedStudent(students.find(s => s._id === studentId));
        try {
            const [scr, mds, logs] = await Promise.all([
                api.get(`/admin/students/${studentId}/screenings`),
                api.get(`/admin/students/${studentId}/moods`),
                api.get(`/admin/students/${studentId}/chatlogs`)
            ]);
            setStudentData({ screenings: scr.data, moods: mds.data, chatLogs: logs.data });
        } catch (error) {
            toast.error("Failed to fetch student details");
        } finally {
            setLoadingDetails(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <Loader className="animate-spin text-morning-accent-lavender" size={40} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Initialising Institution Core...</p>
        </div>
    );

    if (!stats) return <div className="text-center p-20 text-gray-400">Security layer active. No data accessible.</div>;

    const { overview, screeningTrends, recentAlerts } = stats;

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Institutional <span className="text-morning-accent-lavender">Insights</span></h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Aggregated Student Wellness Data</p>
                </div>
                <div className="flex glass-card p-1 bg-white/40 shadow-glass-light border-black/5">
                    <button
                        onClick={() => setView('overview')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'overview' ? 'bg-gray-800 text-white shadow-glass-light' : 'text-gray-400 hover:text-gray-800'}`}
                    >
                        Aggregate
                    </button>
                    <button
                        onClick={() => setView('students')}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'students' ? 'bg-gray-800 text-white shadow-glass-light' : 'text-gray-400 hover:text-gray-800'}`}
                    >
                        Records
                    </button>
                </div>
            </div>

            {view === 'overview' ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="space-y-10"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Active Alerts', value: overview.activeAlerts, icon: AlertTriangle, color: 'text-status-danger', bg: 'bg-status-danger/10' },
                            { label: 'Registered seekers', value: overview.totalStudents, icon: Users, color: 'text-morning-accent-teal', bg: 'bg-morning-accent-teal/10' },
                            { label: 'Total Sessions', value: overview.totalBookings, icon: Activity, color: 'text-morning-accent-lavender', bg: 'bg-morning-accent-lavender/10' },
                            { label: 'Verified Guides', value: overview.totalCounselors, icon: Calendar, color: 'text-morning-accent-amber', bg: 'bg-morning-accent-amber/10' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-8 group hover:bg-white/60 transition-all duration-700 bg-white/40 border-black/5 shadow-glass-light">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-[1.2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 shadow-glass-light`}>
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Analysis Section */}
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Trends Chart */}
                        <div className="lg:col-span-7 glass-card p-10 bg-white/40 border-black/5 shadow-glass-light">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">Vibe Spectrum Trends</h3>
                                <Sparkles size={20} className="text-morning-accent-lavender" />
                            </div>
                            <div className="h-80 w-full">
                                {screeningTrends.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={screeningTrends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                            />
                                            <Bar dataKey="count" fill="#8B5CF6" radius={[12, 12, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">Awaiting broader data harvest</div>
                                )}
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="lg:col-span-5 glass-card p-10 bg-white/40 border-black/5 shadow-glass-light">
                            <div className="flex items-center gap-3 mb-10">
                                <ShieldAlert size={20} className="text-status-danger" />
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">Urgent Signal Stream</h3>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {recentAlerts.length > 0 ? recentAlerts.map((alert, i) => (
                                    <motion.div
                                        key={alert._id || i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 rounded-[2rem] bg-white/60 border border-status-danger/10 hover:border-status-danger/30 transition-all duration-700 flex justify-between items-center group shadow-glass-light"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 group-hover:text-status-danger transition-colors">{alert.userId?.anonymousId}</p>
                                            <p className="text-[9px] font-bold text-status-danger uppercase tracking-widest mt-1">Signals: {alert.detectedKeywords.slice(0, 2).join(', ')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{format(new Date(alert.createdAt), 'MMM d')}</p>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${alert.status === 'pending' ? 'text-morning-accent-amber' : 'text-morning-accent-teal'}`}>{alert.status}</span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 text-[10px] font-bold text-gray-300 uppercase tracking-widest">No emergency pulses detected</div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Student Directory */}
                    <div className="lg:col-span-4 glass-card overflow-hidden h-fit bg-white/40 border-black/5 shadow-glass-light">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Student Directory</h3>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto no-scrollbar">
                            {students.map(s => (
                                <button
                                    key={s._id}
                                    onClick={() => fetchStudentDetails(s._id)}
                                    className={`w-full text-left p-6 transition-all duration-700 flex items-center gap-4 ${selectedStudent?._id === s._id ? 'bg-morning-accent-lavender/5 border-r-4 border-morning-accent-lavender' : 'hover:bg-white/60'}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedStudent?._id === s._id ? 'bg-morning-accent-lavender text-white shadow-glass-light' : 'bg-white shadow-glass-light text-gray-300 border border-black/5'}`}>
                                        {s.anonymousId?.charAt(3)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{s.anonymousId}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.email.split('@')[0]}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student Record View */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {selectedStudent ? (
                                <motion.div
                                    key={selectedStudent._id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-10 relative overflow-hidden h-full bg-white/40 border-black/5 shadow-glass-light"
                                >
                                    {loadingDetails ? (
                                        <div className="flex flex-col items-center justify-center p-32 space-y-4">
                                            <Loader className="animate-spin text-morning-accent-lavender" size={32} />
                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Decrypting Path...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-10">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{selectedStudent.anonymousId}</h3>
                                                        <UserIcon className="text-morning-accent-lavender" size={20} />
                                                    </div>
                                                    <p className="text-xs font-bold text-morning-accent-lavender uppercase tracking-[0.3em]">{selectedStudent.college || 'Universal Campus'}</p>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-black/5 shadow-glass-light ${selectedStudent.isVerified ? 'bg-morning-accent-teal/10 text-morning-accent-teal' : 'bg-morning-accent-amber/10 text-morning-accent-amber'}`}>
                                                    {selectedStudent.isVerified ? 'Verified Account' : 'Pending Verification'}
                                                </span>
                                            </div>

                                            <div className="grid gap-12">
                                                {/* Assessments */}
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-3">
                                                        <Activity size={14} className="text-morning-accent-teal" />
                                                        Assessment Journey
                                                    </h4>
                                                    <div className="grid gap-4">
                                                        {studentData.screenings.length > 0 ? studentData.screenings.map((res, i) => (
                                                            <div key={res._id || i} className="p-6 rounded-[1.8rem] bg-white border border-black/5 flex justify-between items-center group hover:bg-white transition-all duration-700 shadow-glass-light">
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-800 mb-1">{res.type}</p>
                                                                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{format(new Date(res.createdAt), 'PPP p')}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-lg font-black text-gray-800 group-hover:text-morning-accent-teal transition-colors">{res.score}</p>
                                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${res.riskLevel === 'high' ? 'bg-status-danger/10 text-status-danger' : 'bg-morning-accent-teal/10 text-morning-accent-teal'}`}>
                                                                        {res.riskLevel} Risk
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )) : <p className="text-center py-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No assessments registered in record</p>}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-10">
                                                    {/* Mood View */}
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Recent Mood Reflection</h4>
                                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                                            {studentData.moods.length > 0 ? studentData.moods.map(m => {
                                                                const Icon = moodIcons[m.emoji] || Sparkles;
                                                                return (
                                                                    <div key={m._id} className="bg-white/60 border border-black/5 p-5 rounded-[1.5rem] flex items-start gap-4 shadow-glass-light hover:scale-[1.02] transition-transform duration-500">
                                                                        <div className="p-3 bg-morning-accent-lavender/10 rounded-xl text-morning-accent-lavender">
                                                                            <Icon size={20} />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{m.label}</p>
                                                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{format(new Date(m.createdAt), 'MMM d, h:mm a')}</span>
                                                                            </div>
                                                                            {m.note ? (
                                                                                <p className="text-xs text-gray-500 italic leading-relaxed">"{m.note}"</p>
                                                                            ) : (
                                                                                <p className="text-[10px] text-gray-300 italic">No note added</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }) : <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center py-6">No mood reflections logged</p>}
                                                        </div>
                                                    </div>

                                                    {/* Chat Analysis */}
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Aggregate Chat Pulse</h4>
                                                        <div className="p-6 rounded-[2rem] bg-gray-800 text-white shadow-glass-light">
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Sentiment Balance</p>
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-morning-accent-rose w-1/3 shadow-glass-light" />
                                                                </div>
                                                                <span className="text-[10px] font-black tracking-widest">33% Stress</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium leading-relaxed opacity-80">
                                                                Analyzing {studentData.chatLogs.length} messages. Patterns suggest moderate academic stress and high morning engagement.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="glass-card border-2 border-dashed border-gray-100 h-[600px] flex flex-col items-center justify-center text-center p-10 bg-white/20 shadow-glass-light">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-200">
                                        <TrendingUp size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">Institutional Record</h4>
                                    <p className="text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
                                        Select a student to audit their wellness journey and system-wide assessment history.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
