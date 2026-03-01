import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
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
            className="max-w-7xl mx-auto space-y-8 animate-fade-in"
        >
            <motion.div variants={STAGGER_CHILD_VARIANTS}>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Good morning, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
                <p className="text-slate-500 mt-2 text-lg">Here's your wellness overview for today.</p>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={STAGGER_CHILD_VARIANTS} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Mood Score', value: '8.5', change: '+12%', color: 'primary', icon: Activity },
                    { title: 'Sessions Completed', value: '12', change: '+2', color: 'secondary', icon: Calendar },
                    { title: 'Current Streak', value: '5 days', change: '+1', color: 'emerald', icon: TrendingUp }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500 blur-[80px] opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3.5 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 ring-1 ring-${stat.color}-100`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                                <TrendingUp className="w-3 h-3" /> {stat.change}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Recent Activity / Content */}
            <motion.div variants={STAGGER_CHILD_VARIANTS} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-heading font-bold text-slate-900">Your Progress</h2>
                        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 px-4 py-2 outline-none font-medium transition-all">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', score: 6 }, { name: 'Tue', score: 7 }, { name: 'Wed', score: 8 },
                                { name: 'Thu', score: 7.5 }, { name: 'Fri', score: 9 }, { name: 'Sat', score: 8.5 }, { name: 'Sun', score: 9 }
                            ]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '12px' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-bold text-slate-900">Upcoming</h2>
                        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {[1, 2].map((i) => (
                            <div key={i} onClick={() => navigate('/appointments')} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 transition-all group cursor-pointer hover:-translate-y-0.5 shadow-sm">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold relative shadow-inner">
                                        D
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Dr. Sarah Jenkins</h4>
                                        <p className="text-xs font-semibold text-slate-500 border border-slate-200 inline-block px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 bg-white">Clinical</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> Tomorrow, 10:00 AM</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/appointments')} className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                        + Book New Session
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
