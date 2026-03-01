import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Square, Activity, ArrowLeft, Maximize2 } from 'lucide-react';

const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

type ExerciseType = 'box' | '478' | 'grounding';

interface Exercise {
    id: ExerciseType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    instruction: string;
    theme: string;
}

const exercises: Exercise[] = [
    {
        id: 'box',
        title: 'Box Breathing',
        description: 'Navy SEAL technique for intense focus and rapid stress relief.',
        instruction: 'Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)',
        icon: Square,
        color: 'from-blue-500 to-indigo-600',
        theme: 'bg-indigo-950'
    },
    {
        id: '478',
        title: '4-7-8 Relaxation',
        description: 'Promotes deep sleep and significant anxiety reduction.',
        instruction: 'Inhale (4s) → Hold (7s) → Exhale (8s)',
        icon: Wind,
        color: 'from-fuchsia-500 to-purple-600',
        theme: 'bg-fuchsia-950'
    },
    {
        id: 'grounding',
        title: 'Grounding Wave',
        description: 'Designed for panic attack management and physiological resetting.',
        instruction: 'Rhythmic 5-5-5 continuous breathing pattern.',
        icon: Activity,
        color: 'from-teal-400 to-emerald-600',
        theme: 'bg-teal-950'
    }
];

export const BreathingExercisesPage: React.FC = () => {
    const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
    const [isActive, setIsActive] = useState(false);

    // Box Breathing Animation
    const BoxAnimation = () => {
        const [text, setText] = useState('Inhale');
        const timerRef = useRef<number | null>(null);

        useEffect(() => {
            const intervals = [4000, 4000, 4000, 4000];
            const texts = ['Inhale', 'Hold', 'Exhale', 'Hold'];
            let currentIndex = 0;

            const nextStep = () => {
                const duration = intervals[currentIndex];
                setText(texts[currentIndex]);
                currentIndex = (currentIndex + 1) % intervals.length;
                timerRef.current = setTimeout(nextStep, duration);
            };

            nextStep();
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }, []);

        return (
            <div className="relative w-72 h-72 flex items-center justify-center">
                <div className="absolute w-full h-full border-[6px] border-white/20 rounded-3xl" />
                <motion.div
                    className="absolute w-10 h-10 bg-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                    animate={{
                        top: ['0%', '0%', '100%', '100%', '0%'],
                        left: ['0%', '100%', '100%', '0%', '0%'],
                        x: ['0%', '-100%', '-100%', '0%', '0%'],
                        y: ['0%', '0%', '-100%', '-100%', '0%']
                    }}
                    transition={{
                        duration: 16,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
                <div className="text-4xl font-heading font-black text-white tracking-widest uppercase z-10 filter drop-shadow-md">{text}</div>
            </div>
        );
    };

    // 4-7-8 Animation
    const LotusAnimation = () => {
        const [text, setText] = useState('Inhale');
        const timerRef = useRef<number | null>(null);

        useEffect(() => {
            const intervals = [4000, 7000, 8000];
            const texts = ['Inhale', 'Hold', 'Exhale'];
            let currentIndex = 0;

            const nextStep = () => {
                const duration = intervals[currentIndex];
                setText(texts[currentIndex]);
                currentIndex = (currentIndex + 1) % intervals.length;
                timerRef.current = setTimeout(nextStep, duration);
            };

            nextStep();
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }, []);

        return (
            <div className="relative flex items-center justify-center h-96 w-96">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/20 rounded-full mix-blend-overlay filter blur-xl shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                        style={{ width: 140, height: 140 }}
                        animate={{
                            scale: [1, 2.5, 2.5, 1],
                            opacity: [0.3, 0.8, 0.8, 0.3],
                            rotate: [0, 180, 180, 0]
                        }}
                        transition={{
                            duration: 19,
                            times: [0, 0.21, 0.58, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    />
                ))}
                <div className="absolute z-10 text-4xl font-heading font-black text-white tracking-widest uppercase filter drop-shadow-md">{text}</div>
            </div>
        );
    };

    // Grounding Wave Animation
    const WaveAnimation = () => {
        const [text, setText] = useState('Inhale');
        const timerRef = useRef<number | null>(null);

        useEffect(() => {
            const intervals = [5000, 5000, 5000];
            const texts = ['Inhale', 'Hold', 'Exhale'];
            let currentIndex = 0;

            const nextStep = () => {
                const duration = intervals[currentIndex];
                setText(texts[currentIndex]);
                currentIndex = (currentIndex + 1) % intervals.length;
                timerRef.current = setTimeout(nextStep, duration);
            };

            nextStep();
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }, []);

        return (
            <div className="relative w-80 h-80 flex items-end justify-center overflow-hidden rounded-full border-[6px] border-white/20 bg-black/20 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <motion.div
                    className="w-[150%] h-[150%] bg-white/30 rounded-[45%] absolute bottom-[-50%]"
                    animate={{
                        y: ['70%', '-20%', '-20%', '70%'],
                        rotate: [0, 90, 180, 360]
                    }}
                    transition={{
                        y: {
                            duration: 15,
                            times: [0, 0.333, 0.666, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                        },
                        rotate: {
                            duration: 10,
                            ease: "linear",
                            repeat: Infinity
                        }
                    }}
                />
                <motion.div
                    className="w-[150%] h-[150%] bg-white/20 rounded-[40%] absolute bottom-[-50%]"
                    animate={{
                        y: ['75%', '-15%', '-15%', '75%'],
                        rotate: [360, 180, 90, 0]
                    }}
                    transition={{
                        y: {
                            duration: 15,
                            times: [0, 0.333, 0.666, 1],
                            ease: "easeInOut",
                            repeat: Infinity,
                        },
                        rotate: {
                            duration: 12,
                            ease: "linear",
                            repeat: Infinity
                        }
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10 text-4xl font-heading font-black text-white tracking-widest uppercase filter drop-shadow-md">{text}</div>
            </div>
        );
    };

    const activeTheme = exercises.find(e => e.id === selectedExercise)?.theme || 'bg-slate-900';

    return (
        <React.Fragment>
            {/* Standard Dashboard View Segment */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
                className="max-w-7xl mx-auto space-y-8"
            >
                <motion.div variants={STAGGER_CHILD_VARIANTS} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Breathing Space</h1>
                        <p className="text-slate-500 mt-2 text-lg">Select a guided breathing pattern to find your center and relieve stress.</p>
                    </div>
                </motion.div>

                <motion.div variants={STAGGER_CHILD_VARIANTS} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exercises.map((ex) => (
                        <motion.div
                            key={ex.id}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col relative overflow-hidden"
                            onClick={() => {
                                setSelectedExercise(ex.id);
                                setIsActive(true);
                            }}
                        >
                            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${ex.color} opacity-5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:opacity-10 transition-opacity`}></div>

                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ex.color} flex items-center justify-center text-white mb-8 shadow-lg relative z-10`}>
                                <ex.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3 relative z-10">{ex.title}</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed relative z-10 flex-1">{ex.description}</p>

                            <div className="mt-auto relative z-10">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Pattern</span>
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between">
                                    {ex.instruction}
                                    <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Immersive Breathing Session Overlay */}
            <AnimatePresence>
                {isActive && selectedExercise && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`fixed inset-0 z-[100] ${activeTheme} flex flex-col items-center justify-center p-6 overflow-hidden`}
                    >
                        {/* Background Ambience */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <motion.div
                                className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[120px]"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px]"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.2, 0.5, 0.2],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            />
                        </div>

                        <button
                            onClick={() => {
                                setIsActive(false);
                                setTimeout(() => setSelectedExercise(null), 600);
                            }}
                            className="absolute top-8 left-8 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl transition-all z-20 flex items-center gap-2 font-semibold shadow-2xl"
                        >
                            <ArrowLeft className="w-5 h-5" /> Exit Session
                        </button>

                        <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10 flex-1">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold text-white/80 mb-16 tracking-[0.2em] uppercase font-heading"
                            >
                                {exercises.find(e => e.id === selectedExercise)?.title}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, duration: 1 }}
                                className="flex items-center justify-center w-full"
                            >
                                {selectedExercise === 'box' && <BoxAnimation />}
                                {selectedExercise === '478' && <LotusAnimation />}
                                {selectedExercise === 'grounding' && <WaveAnimation />}
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-10 text-white/40 text-sm font-medium tracking-wide"
                        >
                            Close your eyes if you feel comfortable.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
};
