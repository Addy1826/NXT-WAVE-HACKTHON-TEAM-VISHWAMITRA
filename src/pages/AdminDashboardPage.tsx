import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Users, Activity, ShieldCheck, Settings, TrendingDown,
    Filter, Download, ChevronRight, ChevronLeft, Search, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
    { name: 'Jan', users: 4000, revenue: 2400 },
    { name: 'Feb', users: 3000, revenue: 1398 },
    { name: 'Mar', users: 2000, revenue: 9800 },
    { name: 'Apr', users: 2780, revenue: 3908 },
    { name: 'May', users: 1890, revenue: 4800 },
    { name: 'Jun', users: 2390, revenue: 3800 },
    { name: 'Jul', users: 3490, revenue: 4300 },
];

const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Overview');

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
            className="w-full max-w-7xl mx-auto space-y-8"
        >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <motion.div variants={STAGGER_CHILD_VARIANTS}>
                    <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Metrics and platform health tracking for {user?.name || 'Administrator'}.</p>
                </motion.div>

                <motion.div variants={STAGGER_CHILD_VARIANTS} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/20">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5 focus:outline-none">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </motion.div>
            </div>

            {/* Quick Stats Grid */}
            <motion.div variants={STAGGER_CHILD_VARIANTS} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Gross Revenue', value: '₹8,42,480', trend: '+12.5%', isPositive: true, icon: Activity, color: 'emerald' },
                    { title: 'Active Accounts', value: '1,248', trend: '+14.2%', isPositive: true, icon: Users, color: 'blue' },
                    { title: 'System Health', value: '99.9%', trend: 'Optimum', isPositive: true, icon: ShieldCheck, color: 'indigo' },
                    { title: 'Pending Audits', value: '23', trend: 'Needs review', isPositive: false, icon: Settings, color: 'rose' },
                ].map((stat, i) => (
                    <motion.div
                        whileHover={{ y: -4, scale: 1.01 }}
                        key={i}
                        className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all cursor-pointer relative overflow-hidden group"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500 blur-[80px] opacity-[0.08] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.15] transition-opacity`}></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center border border-${stat.color}-100 shadow-sm`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${stat.color === 'emerald' || stat.title === 'System Health' || stat.title === 'Active Accounts'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-black font-heading text-slate-900 tracking-tight mb-2">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={STAGGER_CHILD_VARIANTS} className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary-50 to-transparent opacity-50 pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                        <div>
                            <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">Revenue Analytics</h2>
                            <p className="text-slate-500 font-medium text-sm mt-1">Platform gross revenue over time.</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 p-2.5 outline-none appearance-none shadow-sm cursor-pointer pr-10 relative">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Year to Date</option>
                        </select>
                    </div>

                    <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={STAGGER_CHILD_VARIANTS} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">User Acquisition</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">New signups per month.</p>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} dy={10} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 6, 6]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Registry Table */}
            <motion.div variants={STAGGER_CHILD_VARIANTS} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">Active Directory</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Manage global user accounts across the platform.</p>
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'Overview' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('Overview')}>All Users</button>
                        <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'Patients' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('Patients')}>Patients</button>
                        <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'Therapists' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('Therapists')}>Practitioners</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Account Details</th>
                                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Role Type</th>
                                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Status Auth</th>
                                <th className="py-5 px-8 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: 'Alice Smith', email: 'alice@example.com', role: 'Patient', status: 'Active', img: '1' },
                                { name: 'Dr. John Doe', email: 'john@example.com', role: 'Therapist', status: 'Pending Verification', img: '2' },
                                { name: 'Bob Johnson', email: 'bob@example.com', role: 'Patient', status: 'Active', img: '3' },
                                { name: 'Sarah Connor', email: 'sarah@example.com', role: 'Patient', status: 'Suspended', img: '4' },
                            ]
                                .filter(row => activeTab === 'Overview' || (activeTab === 'Patients' && row.role === 'Patient') || (activeTab === 'Therapists' && row.role === 'Therapist'))
                                .map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={`https://ui-avatars.com/api/?name=${row.name.replace(' ', '+')}&background=random&color=fff`} alt={row.name} className="w-12 h-12 rounded-2xl shadow-sm border border-slate-100 object-cover" />
                                                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${row.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{row.name}</p>
                                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{row.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border tracking-wider uppercase ${row.role === 'Therapist' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {row.role}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border tracking-wider uppercase ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                row.status === 'Suspended' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 border border-transparent hover:border-primary-100 rounded-xl transition-all inline-flex items-center justify-center">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white text-sm">
                    <span className="font-bold text-slate-500">Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">4</span> of <span className="text-slate-900">1,248</span></span>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 border border-slate-200 transition-all shadow-sm" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-md">1</button>
                        <button className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-all border border-transparent">2</button>
                        <button className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-all border border-transparent">3</button>
                        <span className="px-2 text-slate-400 font-bold">...</span>
                        <button className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
