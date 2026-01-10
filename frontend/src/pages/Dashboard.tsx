import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatWindow } from '../components/ChatWindow';
import { TherapistList } from '../components/TherapistList';
import { TherapistProfile } from '../components/TherapistProfile';
import { InspirationPage } from './InspirationPage';
import { ProfilePage } from './ProfilePage';
import api from '../services/api';
import { LogOut, MessageSquare, Calendar, User, Home, TrendingUp, BookOpen, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'appointments' | 'profile'>('home');

    useEffect(() => {
        if (user?.role === 'therapist') {
            navigate('/therapist/dashboard', { replace: true });
            return;
        }
        fetchConversations();
        fetchAppointments();
    }, [user, navigate]);

    const [appointments, setAppointments] = useState<any[]>([]);

    const fetchAppointments = async () => {
        try {
            const data = await api.getAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations');
            // Filter out AI Bot conversations (participants include 'bot')
            const humanConversations = response.data.filter((c: any) =>
                !c.participants.some((p: any) => p === 'bot' || p?.name === 'bot' || p?._id === 'bot')
            );
            setConversations(humanConversations);
            if (humanConversations.length > 0 && !selectedConversationId) {
                setSelectedConversationId(humanConversations[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    const [selectedTherapist, setSelectedTherapist] = useState<any | null>(null);

    const handleChatWithTherapist = async (therapistId: string) => {
        try {
            // Check if conversation already exists
            const existingConv = conversations.find(c =>
                c.participants.some((p: any) => (p._id === therapistId || p === therapistId))
            );

            if (existingConv) {
                setSelectedConversationId(existingConv._id);
            } else {
                // Create new conversation
                const response = await api.post('/chat/conversations', {
                    participants: [therapistId],
                    type: 'direct'
                });
                setConversations(prev => [response.data, ...prev]);
                setSelectedConversationId(response.data._id);
            }

            // Switch to chat tab
            setActiveTab('chat');
            setSelectedTherapist(null); // Close profile
        } catch (error) {
            console.error('Failed to start chat', error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                        MindfulAI
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        <span className="font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/messages')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">Messages</span>
                    </button>
                    <button
                        onClick={() => navigate('/appointments')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                    >
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Appointments</span>
                    </button>
                    <button
                        onClick={() => navigate('/chatbot')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                    >
                        <Bot className="h-5 w-5" />
                        <span className="font-medium">AI Assistant</span>
                    </button>
                    <button
                        onClick={() => navigate('/progress')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                    >
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-medium">My Progress</span>
                    </button>
                    <button
                        onClick={() => navigate('/resources')}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
                    >
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Resources</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <User className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/';
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {activeTab === 'home' && <InspirationPage />}

                {activeTab === 'chat' && (
                    <div className="flex-1 flex">
                        {/* Conversation List */}
                        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-bold text-slate-700">Your Conversations</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {conversations.map(conv => (
                                    <button
                                        key={conv._id}
                                        onClick={() => setSelectedConversationId(conv._id)}
                                        className={`w-full p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedConversationId === conv._id ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-slate-900 truncate">
                                                {conv.type === 'group' ? conv.groupName : 'Direct Chat'}
                                            </h4>
                                            <span className="text-xs text-slate-500">
                                                {new Date(conv.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate mt-1">
                                            {conv.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-slate-50 p-4">
                            {selectedConversationId ? (
                                <ChatWindow conversationId={selectedConversationId} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    Select a conversation to start chatting
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="p-8 overflow-y-auto h-full">
                        {selectedTherapist ? (
                            <TherapistProfile
                                therapist={selectedTherapist}
                                onBack={() => setSelectedTherapist(null)}
                                onChat={() => handleChatWithTherapist(selectedTherapist._id)}
                                onBookingComplete={fetchAppointments}
                            />
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Find a Specialist</h2>
                                    <div className="flex gap-2">
                                        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                                            <option>All Specializations</option>
                                            <option>Anxiety</option>
                                            <option>Depression</option>
                                            <option>Couples Therapy</option>
                                        </select>
                                    </div>
                                </div>
                                <TherapistList onSelect={setSelectedTherapist} />
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && <ProfilePage />}
            </main>
        </div>
    );
};
