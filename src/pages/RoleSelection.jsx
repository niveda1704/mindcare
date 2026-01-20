import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, ShieldCheck } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        { id: 'student', title: 'Seeker', icon: GraduationCap, desc: 'Find balance & inner peace', color: 'bg-morning-accent-lavender/20 text-morning-accent-lavender' },
        { id: 'counselor', title: 'Guide', icon: Users, desc: 'Support & nurture growth', color: 'bg-morning-accent-teal/20 text-morning-accent-teal' },
        { id: 'admin', title: 'Guardian', icon: ShieldCheck, desc: 'Oversee the sanctuary', color: 'bg-gray-100 text-gray-500' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <NatureBackground />

            <div className="relative z-10 w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight mb-4">
                        Select Your <span className="text-morning-accent-lavender">Path</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Choose your perspective</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {roles.map((role, idx) => (
                        <motion.button
                            key={role.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => navigate(`/login/${role.id}`)}
                            className="glass-card p-10 flex flex-col items-center text-center group hover:bg-white/60 transition-all duration-500 bg-white/40 border-black/5 shadow-glass-light"
                        >
                            <div className={`w-24 h-24 rounded-full ${role.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-3xl`}>
                                <role.icon size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{role.title}</h3>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{role.desc}</p>

                            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-300 pb-1">Enter Now</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
