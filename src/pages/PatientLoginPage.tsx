import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';

export const PatientLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const { login } = useAuth();
    // import api from '../services/api'; // I need to make sure I add the import at the top too.

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            // Check if user is actually a patient if you want to restrict login
            if (response.data.user.role !== 'patient') {
                // Optional: Allow them but redirect elsewhere, or block. 
                // For now, let's assume we want to let them in but maybe warn or just proceed.
                // But the UI is specific to patients so maybe we should check.
                if (response.data.user.role === 'therapist') {
                    // Redirect therapist to their dashboard if they accidentally login here?
                    login(response.data.token, response.data.user);
                    navigate('/therapist/dashboard');
                    return;
                }
            }

            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-2xl -mr-16 -mt-16 opacity-50"></div>

                {/* Back Link */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-primary-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4 text-primary-600">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-heading text-primary-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your personal space.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg hover:bg-primary-700 hover:-translate-y-0.5 transition-all
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600 mb-4">Don't have an account?</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => navigate('/signup/patient')}
                            className="text-primary-700 font-semibold hover:text-primary-800 hover:underline"
                        >
                            Sign up here
                        </button>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Or start anonymous chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
