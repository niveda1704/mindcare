import React from 'react';
import { Volume2, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

const AmbientSound = () => {
    const { isPlaying, toggle } = useSound();

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className={`flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl border shadow-glass-light transition-all duration-700 ${isPlaying
                        ? 'bg-morning-accent-teal/80 text-white border-morning-accent-teal/20'
                        : 'bg-white/60 text-gray-500 border-black/5 hover:bg-white/80'
                    }`}
            >
                {isPlaying ? (
                    <>
                        <div className="relative">
                            <Volume2 size={20} />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline-block">Serenity On</span>
                    </>
                ) : (
                    <>
                        <Music size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline-block">Enable Calm</span>
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default AmbientSound;
