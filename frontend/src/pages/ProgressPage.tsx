import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, Activity, Plus } from 'lucide-react';
import api from '../services/api';

const moodScale: Record<string, number> = {
    'Great': 5,
    'Good': 4,
    'Okay': 3,
    'Low': 2,
    'Bad': 1
};

const reverseMoodScale: Record<number, string> = {
    5: 'Great',
    4: 'Good',
    3: 'Okay',
    2: 'Low',
    1: 'Bad'
};

export const ProgressPage: React.FC = () => {
    const [moodHistory, setMoodHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogModal, setShowLogModal] = useState(false);
    const [newMood, setNewMood] = useState('Good');
    const [newNote, setNewNote] = useState('');

    const fetchMoods = async () => {
        try {
            const data = await api.getMoodHistory();
            // Process data for charts
            const processed = data.map((entry: any) => ({
                ...entry,
                score: moodScale[entry.mood] || 3,
                date: new Date(entry.timestamp).toLocaleDateString(),
                fullDate: new Date(entry.timestamp)
            })).sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());

            setMoodHistory(processed);
        } catch (error) {
            console.error('Failed to fetch mood history', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoods();
    }, []);

    const handleLogMood = async () => {
        try {
            await api.logMood({ mood: newMood, note: newNote });
            setShowLogModal(false);
            setNewNote('');
            fetchMoods(); // Refresh chart
        } catch (error) {
            console.error('Failed to log mood', error);
        }
    };

    // Calculate Stats
    const averageMood = moodHistory.length > 0
        ? (moodHistory.reduce((acc, curr) => acc + curr.score, 0) / moodHistory.length).toFixed(1)
        : 'N/A';

    const streak = 3; // Placeholder for streak logic

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
                    <p className="text-slate-500 mt-1">Track your emotional journey and milestones.</p>
                </div>
                <button
                    onClick={() => setShowLogModal(true)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Log Today's Mood
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Average Mood</p>
                        <p className="text-2xl font-bold text-slate-900">{averageMood} / 5.0</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Entries</p>
                        <p className="text-2xl font-bold text-slate-900">{moodHistory.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Current Streak</p>
                        <p className="text-2xl font-bold text-slate-900">{streak} Days</p>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Mood Timeline</h3>
                <div className="h-[400px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
                    ) : moodHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={moodHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[1, 5]}
                                    ticks={[1, 2, 3, 4, 5]}
                                    tickFormatter={(value) => reverseMoodScale[value]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMood)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <p>No mood data yet. Start logging to see your progress!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Logs List */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Journal</h3>
                <div className="space-y-4">
                    {moodHistory.slice().reverse().slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className={`w-2 h-12 rounded-full ${entry.score >= 4 ? 'bg-green-500' :
                                entry.score === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-slate-900">{entry.mood}</h4>
                                    <span className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</span>
                                </div>
                                {entry.note && <p className="text-slate-600 text-sm">{entry.note}</p>}
                            </div>
                        </div>
                    ))}
                    {moodHistory.length === 0 && (
                        <p className="text-slate-500 italic">No entries yet.</p>
                    )}
                </div>
            </div>

            {/* Log Modal */}
            {showLogModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animation-scale-up">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">How are you feeling?</h2>

                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {Object.keys(moodScale).reverse().map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setNewMood(m)}
                                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${newMood === m
                                        ? 'bg-primary-50 ring-2 ring-primary-500 transform scale-105'
                                        : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full mb-2 ${m === 'Great' ? 'bg-green-100 text-green-600' :
                                        m === 'Good' ? 'bg-emerald-100 text-emerald-600' :
                                            m === 'Okay' ? 'bg-yellow-100 text-yellow-600' :
                                                m === 'Low' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`} />
                                    <span className="text-xs font-medium">{m}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Add a note (optional)</label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-32"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogModal(false)}
                                className="flex-1 px-4 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogMood}
                                className="flex-1 px-4 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                            >
                                Save Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
