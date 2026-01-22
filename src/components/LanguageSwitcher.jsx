import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        let newLang;

        if (currentLang === 'en') newLang = 'hi';
        else if (currentLang === 'hi') newLang = 'ta';
        else newLang = 'en'; // default back to english loop

        i18n.changeLanguage(newLang);
    };

    const getLabel = () => {
        switch (i18n.language) {
            case 'hi': return 'HI';
            case 'ta': return 'TA';
            default: return 'EN';
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full shadow-glass border border-white/40 text-gray-800 font-medium transition-colors hover:bg-white/50"
        >
            <Globe size={18} className="text-gray-700" />
            <span className="uppercase text-sm tracking-widest">
                {getLabel()}
            </span>
        </motion.button>
    );
};

export default LanguageSwitcher;
