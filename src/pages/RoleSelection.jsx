import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, ShieldCheck, Heart, Sun } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'student',
            title: 'Seeker',
            description: 'Access counseling, AI whispers, and wisdom resources.',
            icon: GraduationCap,
            color: 'bg-morning-accent-lavender/5',
            accent: 'text-morning-accent-lavender'
        },
        {
            id: 'counselor',
            title: 'Guide',
            description: 'Support students and manage your guidance sessions.',
            icon: Users,
            color: 'bg-morning-accent-teal/5',
            accent: 'text-morning-accent-teal'
        },
        {
            id: 'admin',
            title: 'Keeper',
            description: 'Oversee the sanctuary and manage platform balance.',
            icon: ShieldCheck,
            color: 'bg-black/[0.02]',
            accent: 'text-gray-400'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <NatureBackground />

            <div className="max-w-6xl w-full z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-20"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        transition={{ duration: 1 }}
                        className="w-24 h-24 bg-white/60 border border-black/5 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-glass-light relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-morning-accent-lavender/5 animate-pulse" />
                        <Sun className="text-morning-accent-lavender relative z-10" size={48} />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 tracking-tighter">
                        Mind<span className="text-morning-accent-lavender">Care</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em] select-none">Begin your journey towards inner peace</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => navigate(`/login/${role.id}`)}
                            className="glass-card p-12 cursor-pointer group flex flex-col items-center text-center bg-white/40 border-black/5 hover:border-morning-accent-lavender/20 hover:bg-white/60 transition-all duration-1000 shadow-glass-light"
                        >
                            <div className={`${role.color} w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-glass-light group-hover:scale-110 transition-all duration-1000 border border-black/[0.02]`}>
                                <role.icon size={44} className={role.accent} />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-morning-accent-lavender transition-colors duration-1000 tracking-tight">{role.title}</h3>
                            <p className="text-gray-500 text-base leading-relaxed font-medium mb-10 px-4">
                                {role.description}
                            </p>

                            <motion.div
                                className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center shadow-glass-light border border-black/5 group-hover:bg-morning-accent-lavender group-hover:text-white group-hover:shadow-[0_0_20px_rgba(155,140,230,0.2)] transition-all duration-1000"
                            >
                                <span className="text-2xl">→</span>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 2 }}
                    className="text-center mt-24"
                >
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.8em] select-none">
                        Always here for your well-being
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RoleSelection;
