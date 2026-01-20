import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, TrendingUp, Activity, Calendar, Loader, ShieldAlert, Sparkles, User as UserIcon, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                toast.error("Access denied or server error");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
            </div>

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
                                        <p className="text-xs font-bold text-gray-800 group-hover:text-status-danger transition-colors">{alert.userId?.name || alert.userId?.anonymousId}</p>
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
        </div>
    );
};

export default AdminDashboard;
