import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Users, User, MoreVertical, Smile, Check, CheckCheck, Paperclip } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
    id: string;
    type: 'direct' | 'group';
    name: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    avatar?: string;
    participants?: string[];
    isOnline?: boolean;
}

export const PatientMessagesPage: React.FC = () => {
    const [activeChat, setActiveChat] = useState<string>('chat1');
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat]);

    // Mock chats
    const chats: Chat[] = [
        {
            id: 'chat1',
            type: 'direct',
            name: 'Dr. Sarah Mehta',
            lastMessage: 'Great progress this week!',
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 2,
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Mehta&background=eff6ff&color=3b82f6&size=100',
            isOnline: true
        },
        {
            id: 'chat2',
            type: 'direct',
            name: 'Dr. Rajesh Kumar',
            lastMessage: "Let's schedule our next session.",
            lastMessageTime: new Date(Date.now() - 86400000),
            unreadCount: 0,
            avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=f3e8ff&color=8b5cf6&size=100',
            isOnline: false
        },
        {
            id: 'group1',
            type: 'group',
            name: 'Anxiety Support Circle',
            lastMessage: 'Maya: Thanks for sharing, really helps!',
            lastMessageTime: new Date(Date.now() - 7200000),
            unreadCount: 5,
            participants: ['You', 'Maya', 'Arjun', 'Priya', 'Dr. Neha']
        },
        {
            id: 'group2',
            type: 'group',
            name: 'Mindfulness Practice',
            lastMessage: 'Guided meditation session tomorrow at 7 PM',
            lastMessageTime: new Date(Date.now() - 172800000),
            unreadCount: 0,
            participants: ['You', 'Karan', 'Anjali', 'Rohit']
        }
    ];

    // Mock messages for active chat
    const getMockMessages = (chatId: string): Message[] => {
        if (chatId === 'chat1') {
            return [
                {
                    id: 'm1',
                    senderId: 'therapist1',
                    senderName: 'Dr. Sarah Mehta',
                    content: 'Hi! How have you been feeling since our last session?',
                    timestamp: new Date(Date.now() - 7200000),
                    isOwn: false
                },
                {
                    id: 'm2',
                    senderId: 'me',
                    senderName: 'You',
                    content: 'Much better! The breathing exercises really helped during my anxiety attack yesterday.',
                    timestamp: new Date(Date.now() - 7000000),
                    isOwn: true,
                    status: 'read'
                },
                {
                    id: 'm3',
                    senderId: 'therapist1',
                    senderName: 'Dr. Sarah Mehta',
                    content: "That's wonderful to hear! Remember to practice them daily, not just during attacks. It helps build resilience.",
                    timestamp: new Date(Date.now() - 3600000),
                    isOwn: false
                },
                {
                    id: 'm4',
                    senderId: 'therapist1',
                    senderName: 'Dr. Sarah Mehta',
                    content: 'Great progress this week! Let me know if you need anything before our next session.',
                    timestamp: new Date(Date.now() - 1800000),
                    isOwn: false
                }
            ];
        } else if (chatId === 'group1') {
            return [
                {
                    id: 'g1',
                    senderId: 'user1',
                    senderName: 'Maya',
                    content: "Hi everyone! I'm new to this group. Been struggling with social anxiety lately.",
                    timestamp: new Date(Date.now() - 10800000),
                    isOwn: false
                },
                {
                    id: 'g2',
                    senderId: 'user2',
                    senderName: 'Arjun',
                    content: 'Welcome Maya! This is a safe space. We all understand what you\'re going through.',
                    timestamp: new Date(Date.now() - 10000000),
                    isOwn: false
                },
                {
                    id: 'g3',
                    senderId: 'me',
                    senderName: 'You',
                    content: 'Welcome! I found the group exercises really helpful for my anxiety. Dr. Neha is amazing.',
                    timestamp: new Date(Date.now() - 9000000),
                    isOwn: true,
                    status: 'read'
                },
                {
                    id: 'g4',
                    senderId: 'therapist2',
                    senderName: 'Dr. Neha',
                    content: "Welcome Maya! Let's do a quick check-in: How is everyone feeling today? Rate 1-10.",
                    timestamp: new Date(Date.now() - 8000000),
                    isOwn: false
                },
                {
                    id: 'g5',
                    senderId: 'user3',
                    senderName: 'Priya',
                    content: "I'm at a 6 today. Better than yesterday!",
                    timestamp: new Date(Date.now() - 7500000),
                    isOwn: false
                },
                {
                    id: 'g6',
                    senderId: 'user1',
                    senderName: 'Maya',
                    content: 'Thanks for sharing, really helps!',
                    timestamp: new Date(Date.now() - 7200000),
                    isOwn: false
                }
            ];
        }
        return [];
    };

    const messages = getMockMessages(activeChat);
    const currentChat = chats.find(c => c.id === activeChat);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        // Simulate sending immediate local feedback
        console.log('Sending:', newMessage);
        setNewMessage('');
        setTimeout(() => scrollToBottom(), 100);
    };

    const formatTime = (date: Date) => {
        const now = Date.now();
        const diff = now - date.getTime();
        const hours = diff / 3600000;

        if (hours < 1) return `${Math.floor(diff / 60000)}m`;
        if (hours < 24) return `${Math.floor(hours)}h`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const directChats = chats.filter(c => c.type === 'direct');
    const groupChats = chats.filter(c => c.type === 'group');

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] w-full max-w-7xl mx-auto flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative z-10">
            {/* Sidebar List */}
            <div className="w-80 md:w-96 flex-shrink-0 bg-slate-50/50 flex flex-col border-r border-slate-100 z-20 hidden md:flex">
                {/* Search Header */}
                <div className="p-6 pb-4 bg-white/50 backdrop-blur-md sticky top-0 border-b border-slate-100 z-20">
                    <h1 className="text-2xl font-heading font-bold text-slate-900 mb-4 tracking-tight">Messages</h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium shadow-sm transition-all text-slate-800 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-6">
                    {/* Therapists Section */}
                    <div>
                        <div className="flex items-center gap-2 px-3 mb-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Therapists</h3>
                        </div>
                        <div className="space-y-1">
                            {directChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`w-full p-3 rounded-2xl transition-all text-left flex items-start gap-3 group relative overflow-hidden ${activeChat === chat.id
                                            ? 'bg-primary-50 ring-1 ring-primary-100 shadow-sm'
                                            : 'hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-100 border border-transparent'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={chat.avatar}
                                            alt={chat.name}
                                            className="w-12 h-12 rounded-full object-cover shadow-sm bg-white"
                                        />
                                        {chat.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={`font-bold text-sm truncate pr-2 ${activeChat === chat.id ? 'text-primary-900' : 'text-slate-900'}`}>
                                                {chat.name}
                                            </h4>
                                            <span className={`text-[10px] font-semibold whitespace-nowrap ${chat.unreadCount > 0 ? 'text-primary-600' : 'text-slate-400'}`}>
                                                {formatTime(chat.lastMessageTime)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs truncate max-w-[140px] font-medium ${chat.unreadCount > 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="flex-shrink-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary-600 text-white text-[10px] font-bold rounded-full shadow-sm ml-2">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Support Groups Section */}
                    <div>
                        <div className="flex items-center gap-2 px-3 mb-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Groups</h3>
                        </div>
                        <div className="space-y-1 pb-4">
                            {groupChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`w-full p-3 rounded-2xl transition-all text-left flex items-start gap-3 group relative overflow-hidden ${activeChat === chat.id
                                            ? 'bg-secondary-50 ring-1 ring-secondary-100 shadow-sm'
                                            : 'hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-100 border border-transparent'
                                        }`}
                                >
                                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-full flex items-center justify-center text-secondary-600 shadow-inner border border-secondary-200">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={`font-bold text-sm truncate pr-2 ${activeChat === chat.id ? 'text-secondary-900' : 'text-slate-900'}`}>
                                                {chat.name}
                                            </h4>
                                            <span className={`text-[10px] font-semibold whitespace-nowrap ${chat.unreadCount > 0 ? 'text-secondary-600' : 'text-slate-400'}`}>
                                                {formatTime(chat.lastMessageTime)}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate max-w-[140px] font-medium mb-1 ${chat.unreadCount > 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                                            {chat.lastMessage}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                {chat.participants?.length} Members
                                            </span>
                                            {chat.unreadCount > 0 && (
                                                <span className="flex-shrink-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-secondary-600 text-white text-[10px] font-bold rounded-full shadow-sm ml-2">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:400px_400px]">
                {currentChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100/80 flex items-center justify-between z-20 shadow-sm relative">
                            <div className="flex items-center gap-4">
                                {currentChat.type === 'direct' ? (
                                    <div className="relative">
                                        <img
                                            src={currentChat.avatar}
                                            alt={currentChat.name}
                                            className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-50"
                                        />
                                        {currentChat.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-11 h-11 bg-gradient-to-br from-secondary-100 to-secondary-50 text-secondary-600 rounded-full flex items-center justify-center border border-secondary-200 shadow-sm">
                                        <Users className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">{currentChat.name}</h3>
                                    {currentChat.type === 'group' ? (
                                        <p className="text-xs font-medium text-slate-500 truncate max-w-sm mt-0.5">
                                            {currentChat.participants?.join(', ')}
                                        </p>
                                    ) : (
                                        <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-0.5">
                                            {currentChat.isOnline ? 'Active Now' : 'Offline'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/95 backdrop-blur-sm relative z-10 scrollbar-hide">
                            <div className="text-center my-6">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-400 shadow-sm uppercase tracking-wider">
                                    Today
                                </span>
                            </div>

                            <AnimatePresence>
                                {messages.map((message, i) => {
                                    const showName = !message.isOwn && currentChat.type === 'group' && (i === 0 || messages[i - 1].senderId !== message.senderId);

                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}
                                        >
                                            <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${message.isOwn ? 'items-end' : 'items-start'}`}>
                                                {showName && (
                                                    <span className="text-xs font-bold text-slate-400 ml-1 mb-1">
                                                        {message.senderName}
                                                    </span>
                                                )}

                                                <div className={`relative px-4 py-3 shadow-sm ${message.isOwn
                                                        ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm border border-primary-700/50 shadow-primary-500/10'
                                                        : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
                                                    }`}>
                                                    <p className={`text-[15px] leading-relaxed font-medium ${message.isOwn ? 'text-white' : 'text-slate-700'}`}>
                                                        {message.content}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                    {message.isOwn && (
                                                        message.status === 'read' ? (
                                                            <CheckCheck className="w-3.5 h-3.5 text-primary-500" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5 text-slate-400" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} className="h-2" />
                        </div>

                        {/* Chat Input Field */}
                        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                            <div className="flex items-end gap-3 max-w-4xl mx-auto">
                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 flex-shrink-0">
                                    <Paperclip className="w-5 h-5" />
                                </button>

                                <div className="flex-1 min-h-[52px] relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 focus-within:bg-white transition-all shadow-sm flex items-end pr-2 overflow-hidden">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        rows={1}
                                        className="w-full py-3.5 pl-4 pr-10 bg-transparent text-slate-800 placeholder:text-slate-400 font-medium resize-none focus:outline-none max-h-32 text-[15px]"
                                    />
                                    <button className="absolute right-2 bottom-[11px] p-1.5 text-slate-400 hover:text-primary-500 transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`p-3.5 rounded-2xl flex items-center justify-center transition-all shadow-sm flex-shrink-0 ${newMessage.trim()
                                            ? 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-0.5 shadow-primary-500/25'
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                                        }`}
                                >
                                    <Send className="w-5 h-5 ml-0.5" />
                                </button>
                            </div>
                            <p className="text-center text-[10px] font-semibold text-slate-400 mt-2">
                                Protected by end-to-end encryption.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                        <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-sm">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 text-slate-300 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner transform rotate-3">
                                <Users className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-slate-900 mb-2 tracking-tight">Your Messages</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                Connect with your therapists and support groups securely. Select a conversation to start messaging.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
