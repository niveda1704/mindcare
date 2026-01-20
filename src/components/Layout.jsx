import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, MessageCircle, Calendar, BookOpen, Users, LogOut, Settings, ClipboardCheck, Heart, Sun, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NatureBackground from './NatureBackground';
import VoiceCompanion from './VoiceCompanion';
import api from '../api/axios';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [health, setHealth] = useState({ backend: 'checking', database: 'checking' });

    React.useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await api.get('/health');
                setHealth({ backend: 'connected', database: res.data.database });
            } catch {
                setHealth({ backend: 'disconnected', database: 'disconnected' });
            }
        };
        checkHealth();
        const timer = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home, roles: ['student'] },
        { name: 'Guide', path: '/chat', icon: MessageCircle, roles: ['student'] },
        { name: 'Dashboard', path: '/counselor', icon: Users, roles: ['counselor'] },
        { name: 'Seekers', path: '/students', icon: Users, roles: ['admin', 'counselor'] },
        { name: 'Vitality', path: '/screening', icon: ClipboardCheck, roles: ['student'] },
        { name: 'Booking', path: '/booking', icon: Calendar, roles: ['student'] },
        { name: 'Whispers', path: '/resources', icon: BookOpen, roles: ['student', 'admin'] },

        { name: 'Admin', path: '/admin', icon: Settings, roles: ['admin'] },
    ];

    // Force Admin Role for Owner (Developer Fix)
    const effectiveRole = (user?.email === 'nivedasree1704@gmail.com')
        ? 'admin'
        : (user?.role || 'student');

    const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(effectiveRole));

    const pageVariants = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -40 }
    };

    return (
        <div className="min-h-screen flex flex-col relative selection:bg-morning-accent-lavender/20">
            <NatureBackground />

            {/* Top Glimmer Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-morning-accent-lavender/30 via-morning-accent-teal/30 to-morning-accent-amber/30 opacity-40 fixed top-0 z-[60]" />

            {/* Navigation */}
            <nav className="bg-white/60 backdrop-blur-2xl sticky top-4 z-50 mx-4 lg:mx-auto max-w-5xl rounded-[2.5rem] border border-black/5 shadow-glass-light">
                <div className="px-8 flex justify-between h-20 items-center">
                    <div className="flex items-center space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -15 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            onClick={() => navigate('/')}
                            className="w-12 h-12 bg-white/40 border border-black/5 rounded-2xl flex items-center justify-center text-morning-accent-lavender shadow-glass-light cursor-pointer group"
                        >
                            <Sun size={22} className="group-hover:text-morning-sage transition-colors duration-1000" />
                        </motion.div>
                        <span className="text-2xl font-black text-gray-800 tracking-tighter cursor-pointer hidden sm:block" onClick={() => navigate('/')}>
                            MindCare
                        </span>

                        <div className="hidden md:flex items-center space-x-2 border-l border-black/5 pl-4 ml-2 h-6">
                            <div className={`w-1.5 h-1.5 rounded-full ${health.backend === 'connected' ? 'bg-morning-accent-teal' : 'bg-status-danger'} shadow-[0_0_8px_rgba(111,205,193,0.3)]`}></div>
                            <div className={`w-1.5 h-1.5 rounded-full ${health.database === 'connected' ? 'bg-morning-accent-lavender' : 'bg-status-danger'} shadow-[0_0_8px_rgba(155,140,230,0.3)]`}></div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {filteredNavItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-1000 ${isActive
                                        ? 'bg-black/5 text-gray-900 shadow-glass-light border border-black/5'
                                        : 'text-gray-400 hover:text-gray-800 hover:bg-black/5 border border-transparent'
                                    }`
                                }
                            >
                                <item.icon size={16} />
                                <span className="hidden lg:inline">{item.name}</span>
                            </NavLink>
                        ))}
                        <div className="border-l border-black/5 pl-4 h-6 flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-[10px] font-black text-morning-accent-lavender">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-morning-accent-rose transition-all duration-700"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 rounded-2xl text-gray-400 hover:text-gray-800 hover:bg-black/5 border border-black/5 transition-all"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-24 left-0 right-0 bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-black/5 shadow-glass-light overflow-hidden mx-4 p-6 z-50 md:hidden"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {filteredNavItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-1000 ${isActive
                                                ? 'bg-black/5 text-gray-900 shadow-glass-light border border-black/5'
                                                : 'bg-black/[0.02] text-gray-400 hover:text-gray-800 border border-transparent'
                                            }`
                                        }
                                    >
                                        <item.icon size={22} className="mb-3" />
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-6 flex items-center justify-center space-x-3 p-5 w-full rounded-[2rem] bg-morning-accent-rose/5 text-morning-accent-rose font-black uppercase tracking-[0.3em] text-[10px] hover:bg-morning-accent-rose hover:text-white transition-all duration-1000 border border-morning-accent-rose/10"
                            >
                                <LogOut size={20} />
                                <span>Signal Exit</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Voice Companion */}
            <VoiceCompanion />

            {/* Footer */}
            <footer className="py-16 text-center select-none flex flex-col items-center gap-4 opacity-30">
                <div className="w-8 h-px bg-black/10" />
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">
                    Serene Morning Design
                </p>
                <div className="w-8 h-px bg-black/10" />
            </footer>
        </div>
    );
};

export default Layout;
