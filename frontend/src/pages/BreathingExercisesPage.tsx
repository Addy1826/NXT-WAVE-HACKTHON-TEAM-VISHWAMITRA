import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Square, Activity, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ExerciseType = 'box' | '478' | 'grounding';

interface Exercise {
    id: ExerciseType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    instruction: string;
}

const exercises: Exercise[] = [
    {
        id: 'box',
        title: 'Box Breathing',
        description: 'Focus and stress relief. Navy SEAL technique.',
        instruction: 'Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)',
        icon: Square,
        color: 'bg-blue-500'
    },
    {
        id: '478',
        title: '4-7-8 Relaxation',
        description: 'Deep sleep and anxiety relief.',
        instruction: 'Inhale (4s) → Hold (7s) → Exhale (8s)',
        icon: Wind,
        color: 'bg-indigo-500'
    },
    {
        id: 'grounding',
        title: 'Grounding Wave',
        description: 'Panic attack management.',
        instruction: 'Rhythmic 5-5-5 breathing pattern.',
        icon: Activity,
        color: 'bg-teal-500'
    }
];

export const BreathingExercisesPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
    const [isActive, setIsActive] = useState(false);

    // Box Breathing Animation (4s - 4s - 4s - 4s)
    const BoxAnimation = () => {
        const [text, setText] = useState('Inhale');

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

            const timerRef = { current: setTimeout(nextStep, 0) }; // Start immediately

            return () => clearTimeout(timerRef.current);
        }, []);

        return (
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute w-full h-full border-4 border-white/20 rounded-xl" />
                <motion.div
                    className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    animate={{
                        top: ['90%', '0%', '0%', '90%', '90%'],
                        left: ['0%', '0%', '90%', '90%', '0%']
                    }}
                    transition={{
                        duration: 16,
                        times: [0, 0.25, 0.5, 0.75, 1],
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />
                <div className="text-4xl font-light text-white z-10">{text}</div>
            </div>
        );
    };

    // 4-7-8 Animation (4s - 7s - 8s)
    const LotusAnimation = () => {
        const [text, setText] = useState('Inhale');

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

            const timerRef = { current: setTimeout(nextStep, 0) };

            return () => clearTimeout(timerRef.current);
        }, []);

        // 4+7+8 = 19s
        // 4/19 = 0.2105
        // (4+7)/19 = 11/19 = 0.5789
        // 19/19 = 1
        return (
            <div className="relative flex items-center justify-center h-96 w-96">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-indigo-200/40 rounded-full mix-blend-screen filter blur-xl"
                        style={{ width: 120, height: 120 }}
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
                <div className="absolute z-10 text-4xl font-light text-white">{text}</div>
            </div>
        );
    };

    // Grounding Wave Animation (5s - 5s - 5s)
    const WaveAnimation = () => {
        const [text, setText] = useState('Inhale');

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

            const timerRef = { current: setTimeout(nextStep, 0) };

            return () => clearTimeout(timerRef.current);
        }, []);

        return (
            <div className="relative w-80 h-80 flex items-end justify-center overflow-hidden rounded-full border-4 border-white/20 bg-teal-900/30 backdrop-blur-sm">
                <motion.div
                    className="w-full bg-teal-400/50"
                    animate={{ height: ['10%', '90%', '90%', '10%'] }}
                    transition={{
                        duration: 15,
                        times: [0, 0.333, 0.666, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10 text-4xl font-light text-white">{text}</div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen transition-colors duration-1000 ${selectedExercise === 'box' ? 'bg-slate-900' :
                selectedExercise === '478' ? 'bg-indigo-950' :
                    selectedExercise === 'grounding' ? 'bg-teal-950' : 'bg-slate-900'
            } flex flex-col items-center justify-center p-6 relative overflow-hidden`}>

            {/* Background Ambience */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <button
                onClick={() => isActive ? setIsActive(false) : navigate('/dashboard')}
                className="absolute top-8 right-8 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-20"
            >
                <X className="w-8 h-8" />
            </button>

            <AnimatePresence mode="wait">
                {!isActive ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl w-full z-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-light text-white mb-2 text-center tracking-wide">Breathing Space</h1>
                        <p className="text-white/60 text-center mb-12 text-lg">Choose your rhythm to find your center.</p>

                        <div className="grid md:grid-cols-3 gap-6">
                            {exercises.map((ex) => (
                                <motion.button
                                    key={ex.id}
                                    whileHover={{ scale: 1.05, translateY: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedExercise(ex.id);
                                        setIsActive(true);
                                    }}
                                    className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-left hover:bg-white/20 transition-all group"
                                >
                                    <div className={`w-14 h-14 ${ex.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-${ex.color}/50 transition-shadow`}>
                                        <ex.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">{ex.title}</h3>
                                    <p className="text-white/60 text-sm mb-4 leading-relaxed">{ex.description}</p>
                                    <div className="text-xs font-mono text-white/40 bg-black/20 p-2 rounded-lg inline-block">
                                        {ex.instruction}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center w-full max-w-4xl z-10 min-h-[60vh]"
                    >
                        <h2 className="text-3xl font-light text-white mb-12 opacity-80 tracking-widest uppercase">
                            {exercises.find(e => e.id === selectedExercise)?.title}
                        </h2>

                        <div className="flex-1 flex items-center justify-center w-full mb-16">
                            {selectedExercise === 'box' && <BoxAnimation />}
                            {selectedExercise === '478' && <LotusAnimation />}
                            {selectedExercise === 'grounding' && <WaveAnimation />}
                        </div>

                        <button
                            onClick={() => {
                                setIsActive(false);
                                setSelectedExercise(null);
                            }}
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium backdrop-blur-sm transition-all border border-white/10 tracking-wide"
                        >
                            End Session
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
