import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const user = response.data.user;
            const token = response.data.token;

            if (user.role !== 'admin') {
                setError('Unauthorized access. Admins only.');
                setIsLoading(false);
                return;
            }

            login(token, user);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-slate-900 flex text-slate-100 overflow-hidden relative">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[160px] opacity-30 select-none pointer-events-none"></div>

            {/* Main Content container */}
            <div className="w-full flex">
                {/* Left Section - Hero/Brand */}
                <div className="hidden lg:flex flex-col justify-center px-16 lg:px-24 w-1/2 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-heading font-black tracking-tight">
                                SaaS<span className="text-primary-500">Admin</span>
                            </span>
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-heading font-bold text-white leading-tight mb-6">
                            Manage your digital ecosystem.
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed mb-12">
                            Access the global control panel. Monitor real-time analytics, manage users, and configure system settings with unparalleled ease.
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="User" className="w-10 h-10 inline-block rounded-full border-2 border-slate-900 shadow-sm" />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-400">Trusted by over <strong className="text-white">50,000</strong> administrators.</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Section - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md bg-white/5 backdrop-blur-3xl rounded-[2rem] p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative top blur inside form */}
                        <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-[80px] -mt-16 opacity-50 z-0"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-primary-400 mb-6 border border-white/10 shadow-inner">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-white mb-2">Admin Portal</h2>
                                <p className="text-slate-400 font-medium">Please sign in to access the control panel.</p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center shadow-lg"
                                >
                                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                                    <span className="font-medium text-red-300">{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm border-l-2 pl-2 border-primary-500 font-semibold text-slate-300 tracking-wide">Email Address</label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm border-l-2 pl-2 border-primary-500 font-semibold text-slate-300 tracking-wide">Password</label>
                                        <a href="#" className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</a>
                                    </div>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`group w-full py-4 mt-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs font-medium text-slate-500">
                                    Protected by zero-knowledge encryption.<br />Authorized personnel only.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
