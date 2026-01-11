import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';

export const TherapistLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay using existing demo logic
        setTimeout(() => {
            localStorage.setItem('token', 'demo_therapist_token');
            localStorage.setItem('user', JSON.stringify({ role: 'therapist', name: 'Dr. Sarah' }));
            navigate('/therapist/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 border border-gray-200">

                {/* Back Link */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-800 mb-8 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg text-primary-800">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-heading text-gray-900">Therapist Portal</h1>
                    </div>
                    <p className="text-gray-600">Secure access for verified specialists.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Work Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="dr.sarah@clinic.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            Remember device
                        </label>
                        <a href="#" className="text-primary-700 hover:text-primary-900 font-medium">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium shadow hover:bg-black transition-all flex items-center justify-center gap-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Verifying...' : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                Secure Login
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                    <div className="mb-4">
                        New therapist? <button onClick={() => navigate('/signup/therapist')} className="text-primary-700 font-medium hover:underline">Apply to join</button>
                    </div>
                    Protected by HIPAA-compliant encryption.
                    <br />
                    System Status: <span className="text-green-600 font-medium">Operational</span>
                </div>
            </div>
        </div>
    );
};
