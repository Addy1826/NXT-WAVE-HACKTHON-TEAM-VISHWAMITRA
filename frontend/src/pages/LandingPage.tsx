import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, MessageCircle, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">MindfulAI</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-primary-600 transition-colors">Features</a>
                            <a href="#therapists" className="text-slate-600 hover:text-primary-600 transition-colors">Therapists</a>
                            <a href="#about" className="text-slate-600 hover:text-primary-600 transition-colors">About</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-primary-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 border border-primary-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            AI-Powered Mental Health Support Available 24/7
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                            Find Peace of Mind <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Whenever You Need It</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Connect with compassionate AI support instantly or book sessions with licensed therapists. Your journey to mental wellness starts here, in a safe and private space.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Start Your Journey <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center"
                            >
                                I'm a Therapist
                            </button>
                        </div>
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> HIPAA Compliant</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 24/7 Availability</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verified Specialists</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Holistic Mental Health Support</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">We combine advanced AI technology with human empathy to provide comprehensive care tailored to your needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageCircle className="w-8 h-8 text-white" />,
                                title: "AI Companion",
                                desc: "Chat with our empathetic AI assistant anytime for immediate support, coping strategies, and crisis intervention.",
                                color: "bg-purple-500"
                            },
                            {
                                icon: <Users className="w-8 h-8 text-white" />,
                                title: "Licensed Therapists",
                                desc: "Browse profiles of verified specialists, read reviews, and book video sessions that fit your schedule.",
                                color: "bg-blue-500"
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-white" />,
                                title: "Safe & Private",
                                desc: "Your privacy is our priority. All conversations are encrypted and anonymous, ensuring a safe space for you.",
                                color: "bg-teal-500"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[128px] opacity-20"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to prioritize your mental health?</h2>
                    <p className="text-xl text-slate-300 mb-10">Join thousands of others who have found support and clarity through MindfulAI.</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-primary-50 transition-all shadow-lg hover:scale-105"
                    >
                        Get Started for Free
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-900 p-1.5 rounded-lg">
                            <Heart className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">MindfulAI</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2024 MindfulAI. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Privacy</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Terms</a>
                        <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
