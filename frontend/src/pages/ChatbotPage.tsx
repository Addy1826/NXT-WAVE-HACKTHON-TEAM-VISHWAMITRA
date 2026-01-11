import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CrisisInterventionModal } from '../components/CrisisInterventionModal';
import { useCrisisDetection } from '../hooks/useCrisisDetection';

interface Message {
    _id: string;
    content: string;
    sender: { _id: string; name: string };
    createdAt: string;
}

export const ChatbotPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Crisis Detection Integration
    const { crisisLevel, isCritical, showModal, detectedKeywords, dismissModal } = useCrisisDetection();

    const handleConnectTherapist = () => {
        // Navigate to therapist selection or booking page
        navigate('/therapists');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        initializeBotChat();
    }, []);

    const initializeBotChat = async () => {
        try {
            const response = await api.post('/chat/conversations', {
                participants: ['bot'],
                type: 'direct'
            });
            setConversationId(response.data._id);
            if (response.data._id) {
                const msgResponse = await api.get(`/chat/conversations/${response.data._id}/messages`);
                setMessages(msgResponse.data.reverse());
            }
        } catch (error) {
            console.error('Failed to init bot chat', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;

        try {
            const content = newMessage;
            setNewMessage('');

            const tempMsg: Message = {
                _id: Date.now().toString(),
                content,
                sender: { _id: (user as any)?._id || 'me', name: user?.name || 'Me' },
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempMsg]);
            setIsTyping(true);

            await api.post(`/chat/conversations/${conversationId}/messages`, { content });

            let attempts = 0;
            const maxAttempts = 15;
            const pollInterval = setInterval(async () => {
                attempts++;
                try {
                    const msgResponse = await api.get(`/chat/conversations/${conversationId}/messages`);
                    const newMessages = msgResponse.data.reverse();
                    const lastMsg = newMessages[newMessages.length - 1];

                    const isBot = !lastMsg.sender || lastMsg.sender === null;
                    const isOtherUser = lastMsg.sender?._id !== (user as any)?._id && lastMsg.sender?._id !== 'me';

                    if (lastMsg && (isBot || isOtherUser)) {
                        setMessages(newMessages);
                        setIsTyping(false);
                        clearInterval(pollInterval);
                    } else if (attempts >= maxAttempts) {
                        setIsTyping(false);
                        clearInterval(pollInterval);
                    }
                } catch (err) {
                    console.error('Polling error', err);
                }
            }, 2000);

        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4">
            <header className="w-full max-w-4xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all hover:shadow-md group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            Mindora
                        </h1>
                        <p className="text-slate-500 mt-2 ml-1">Your 24/7 mental wellness companion.</p>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-4xl flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden h-[80vh]">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">Hello, {user?.name || 'Friend'}</h3>
                                <p className="text-slate-500 max-w-md">I'm here to listen. You can talk to me about your day, your feelings, or anything that's on your mind.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender?._id === (user as any)?._id || msg.sender?._id === 'me';
                            return (
                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    {!isMe && (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0 mt-2">
                                            <Bot className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] p-6 rounded-3xl text-base leading-relaxed shadow-sm ${isMe
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                        <div className={`text-xs mt-2 opacity-60 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {isMe && (
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center ml-4 flex-shrink-0 mt-2">
                                            <User className="w-6 h-6 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}

                    {isTyping && (
                        <div className="flex justify-start items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="bg-slate-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-slate-400 animate-pulse">Mindora is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto flex items-center gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        Mindora is an automated assistant and may make mistakes. For medical emergencies, please call 911.
                    </p>
                </div>
            </div>

            {/* Crisis Intervention Modal */}
            <CrisisInterventionModal
                isOpen={showModal}
                crisisLevel={crisisLevel}
                detectedKeywords={detectedKeywords}
                onClose={dismissModal}
                onConnectTherapist={handleConnectTherapist}
            />
        </div>
    );
};
