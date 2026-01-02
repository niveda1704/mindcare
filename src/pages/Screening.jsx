import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, ArrowRight, CheckCircle, AlertCircle, Info, Star, ChevronLeft, ChevronRight, Sparkles, Loader } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const questionnaires = {
    'PHQ-9': {
        name: 'Morning Quality (PHQ-9)',
        shortName: 'Clarity screening',
        description: 'A gentle 9-question journey to understand your emotional depth and clarity of thought.',
        questions: [
            'Little interest or pleasure in doing things?',
            'Feeling down, depressed, or hopeless?',
            'Trouble falling or staying asleep, or sleeping too much?',
            'Feeling tired or having little energy?',
            'Poor appetite or overeating?',
            'Feeling bad about yourself — or that you are a failure?',
            'Trouble concentrating on things, like reading or studying?',
            'Moving or speaking slowly, or being unusually restless?',
            'Thoughts about being better off dead or hurting yourself?',
        ],
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    },
    'GAD-7': {
        name: 'Serenity Scan (GAD-7)',
        shortName: 'Peace screening',
        description: 'A 7-question tool to measure the waves of anxiety and find your inner serenity.',
        questions: [
            'Feeling nervous, anxious or on edge?',
            'Not being able to stop or control worrying?',
            'Worrying too much about different things?',
            'Trouble relaxing?',
            'Being so restless that it is hard to sit still?',
            'Becoming easily annoyed or irritable?',
            'Feeling afraid as if something awful might happen?',
        ],
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    },
};

const Screening = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const startQuiz = (type) => {
        setSelectedType(type);
        setAnswers(new Array(questionnaires[type].questions.length).fill(null));
        setCurrentQuestion(0);
        setResult(null);
    };

    const handleAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);

        if (currentQuestion < questionnaires[selectedType].questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/screening/${selectedType}`, {
                answers,
            });

            setResult(response.data.result);
            toast.success('Assessment completed with care');
        } catch (error) {
            console.error('Submission failed', error);
            const msg = error.response?.data?.message || 'Failed to save assessment';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-12 relative overflow-hidden bg-white/40 border-black/5 shadow-glass-light"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-morning-accent-rose via-morning-accent-lavender to-morning-accent-teal opacity-30" />

                    <div className={`w-24 h-24 mx-auto rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ${result.riskLevel === 'high' ? 'bg-status-danger/10 text-status-danger' : 'bg-status-success/10 text-status-success'}`}>
                        {result.riskLevel === 'high' ? <AlertCircle size={48} /> : <CheckCircle size={48} />}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Assessment Complete</h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Reflecting on your results</p>

                    <div className={`p-8 rounded-[2rem] mb-10 text-left border ${result.riskLevel === 'high' ? 'bg-status-danger/5 border-status-danger/10 text-status-danger' : 'bg-status-success/5 border-status-success/10 text-status-success'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-black uppercase tracking-widest text-[10px]">Current Profile</h4>
                            <span className="text-2xl font-black">{result.riskLevel.toUpperCase()}</span>
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed">
                            {result.riskLevel === 'high'
                                ? 'Your results indicate a higher intensity of emotional waves. We recommend a gentle conversation with one of our guides to find your center.'
                                : 'Your responses suggest a balanced state of mind. Continue nurturing your radiant spirit!'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedType(null)}
                            className="flex-1 glass-card py-4 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-all border-black/5"
                        >
                            Return to Selection
                        </motion.button>
                        {result.riskLevel === 'high' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={() => window.location.href = '/booking'}
                                className="flex-1 btn-primary py-4 font-bold text-xs uppercase tracking-widest text-white shadow-xl shadow-morning-accent-lavender/20"
                            >
                                Connect to a Guide <ArrowRight size={14} className="ml-2 inline" />
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] px-10 leading-loose">
                    This tool is for personal insight, not clinical diagnosis. Your wellness journey is unique.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 px-6">
            {!selectedType ? (
                <>
                    <header className="relative py-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-morning-accent-lavender/10 text-morning-accent-lavender text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                Wellbeing Assessment
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">Check-in with <span className="text-morning-accent-lavender">Yourself</span></h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                                Our validated tools provide insight into your mental landscape. Select a focus to begin.
                            </p>
                        </motion.div>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {Object.entries(questionnaires).map(([key, q], idx) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -8, rotate: idx % 2 === 0 ? -1 : 1 }}
                                className="glass-card p-10 cursor-pointer group flex flex-col h-full bg-white/40 border-black/5 shadow-glass-light"
                                onClick={() => startQuiz(key)}
                            >
                                <div className="w-16 h-16 bg-white shadow-glass-light rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-gray-800 group-hover:text-white transition-all duration-700">
                                    <ClipboardCheck size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-morning-accent-lavender transition-colors duration-700">{q.name}</h3>
                                <p className="text-[10px] font-bold text-morning-accent-lavender uppercase tracking-widest mb-6">{q.shortName}</p>
                                <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed flex-1">
                                    {q.description}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-800 group-hover:translate-x-2 transition-transform duration-700">
                                    Begin Scan <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 ml-1 group-hover:bg-morning-accent-lavender transition-colors duration-700"><ChevronRight size={14} /></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="glass-card p-8 bg-black/[0.02] border-black/5 max-w-3xl mx-auto shadow-glass-light"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-glass-light">
                                <Info className="text-morning-accent-lavender" size={20} />
                            </div>
                            <div className="pt-1">
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">Sacred Trust & Privacy</p>
                                <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                                    Your responses are encrypted and only accessible by clinical partners if requested. We use this data solely to recommend the best support for your unique experience.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            ) : (
                <div className="max-w-3xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card shadow-glass-light overflow-hidden border-black/10 bg-white/40"
                    >
                        {/* Header Area */}
                        <div className="bg-white/60 backdrop-blur-md p-10 border-b border-black/5">
                            <div className="flex justify-between items-start mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{questionnaires[selectedType].name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        Assessment In Progress <Sparkles size={10} className="text-morning-accent-lavender animate-pulse" />
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedType(null)}
                                    className="p-3 bg-white hover:bg-status-danger/5 hover:text-status-danger rounded-2xl transition-all shadow-glass-light"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">
                                        Question {currentQuestion + 1}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        {Math.round(((currentQuestion + 1) / questionnaires[selectedType].questions.length) * 100)}% Complete
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentQuestion + 1) / questionnaires[selectedType].questions.length) * 100}%` }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-morning-accent-lavender"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="p-10 space-y-10">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={currentQuestion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl font-bold text-gray-800 leading-tight md:text-3xl max-w-2xl"
                                >
                                    {questionnaires[selectedType].questions[currentQuestion]}
                                </motion.h2>
                            </AnimatePresence>

                            <div className="grid gap-4">
                                {questionnaires[selectedType].options.map((opt, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ x: 5 }}
                                        onClick={() => handleAnswer(idx)}
                                        className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-700 flex items-center gap-6 group ${answers[currentQuestion] === idx ? 'bg-gray-800 border-gray-800 text-white shadow-xl shadow-black/10' : 'bg-white border-gray-50 text-gray-500 hover:border-morning-accent-lavender/20 hover:bg-morning-accent-lavender/5'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[10px] transition-all duration-700 ${answers[currentQuestion] === idx ? 'bg-white text-gray-800 scale-110' : 'bg-gray-50 text-gray-300 group-hover:bg-white group-hover:text-morning-accent-lavender'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="font-bold uppercase tracking-widest text-[11px]">{opt}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                                <button
                                    disabled={currentQuestion === 0}
                                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    className="flex items-center gap-2 text-[10px] font-bold text-gray-300 hover:text-gray-800 disabled:opacity-0 transition-all uppercase tracking-widest"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>

                                {currentQuestion === questionnaires[selectedType].questions.length - 1 && answers[currentQuestion] !== null ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="btn-primary px-10 py-5"
                                    >
                                        {loading ? <Loader className="animate-spin" size={18} /> : 'Finalize Assessment'}
                                    </motion.button>
                                ) : (
                                    <span className="text-[10px] text-gray-300 font-black tracking-[0.3em] uppercase">Reflect & Select</span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.5em] select-none opacity-50">
                        Always trust your intuition. We are here to support your path.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Screening;
