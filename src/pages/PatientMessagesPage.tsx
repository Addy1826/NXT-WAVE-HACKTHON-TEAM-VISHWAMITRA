import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Users, User, MoreVertical, Smile } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
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
}

export const PatientMessagesPage: React.FC = () => {
    const [activeChat, setActiveChat] = useState<string>('chat1');
    const [newMessage, setNewMessage] = useState('');

    // Mock chats
    const chats: Chat[] = [
        {
            id: 'chat1',
            type: 'direct',
            name: 'Dr. Sarah Mehta',
            lastMessage: 'Great progress this week!',
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 2,
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Mehta&background=3b82f6&color=fff&size=100'
        },
        {
            id: 'chat2',
            type: 'direct',
            name: 'Dr. Rajesh Kumar',
            lastMessage: "Let's schedule our next session",
            lastMessageTime: new Date(Date.now() - 86400000),
            unreadCount: 0,
            avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=8b5cf6&color=fff&size=100'
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
            name: 'Mindfulness Practice Group',
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
                    isOwn: true
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
                    content: 'Great progress this week!',
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
                    isOwn: true
                },
                {
                    id: 'g4',
                    senderId: 'therapist2',
                    senderName: 'Dr. Neha (Facilitator)',
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
        // TODO: Send message to API
        console.log('Sending:', newMessage);
        setNewMessage('');
    };

    const formatTime = (date: Date) => {
        const now = Date.now();
        const diff = now - date.getTime();
        const hours = diff / 3600000;

        if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
        if (hours < 24) return `${Math.floor(hours)}h ago`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const directChats = chats.filter(c => c.type === 'direct');
    const groupChats = chats.filter(c => c.type === 'group');

    return (
        <div className="h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-neutral-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-neutral-200">
                    <h2 className="text-2xl font-heading text-neutral-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {/* Therapists Section */}
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Therapists
                        </h3>
                        <div className="space-y-1">
                            {directChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`w-full p-3 rounded-lg transition-colors text-left ${activeChat === chat.id
                                        ? 'bg-primary-50 border border-primary-200'
                                        : 'hover:bg-neutral-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={chat.avatar}
                                            alt={chat.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className="font-semibold text-neutral-900 text-sm truncate">
                                                    {chat.name}
                                                </h4>
                                                <span className="text-xs text-neutral-500">
                                                    {formatTime(chat.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-neutral-600 truncate">
                                                    {chat.lastMessage}
                                                </p>
                                                {chat.unreadCount > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Support Groups Section */}
                    <div className="p-4 border-t border-neutral-100">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Support Groups
                        </h3>
                        <div className="space-y-1">
                            {groupChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`w-full p-3 rounded-lg transition-colors text-left ${activeChat === chat.id
                                        ? 'bg-secondary-50 border border-secondary-200'
                                        : 'hover:bg-neutral-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-secondary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <h4 className="font-semibold text-neutral-900 text-sm truncate">
                                                    {chat.name}
                                                </h4>
                                                <span className="text-xs text-neutral-500">
                                                    {formatTime(chat.lastMessageTime)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-600 truncate mb-1">
                                                {chat.lastMessage}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-neutral-500">
                                                    {chat.participants?.length} members
                                                </span>
                                                {chat.unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 bg-secondary-600 text-white text-xs rounded-full">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {currentChat.type === 'direct' ? (
                                        <img
                                            src={currentChat.avatar}
                                            alt={currentChat.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-secondary-600" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-neutral-900">{currentChat.name}</h3>
                                        {currentChat.type === 'group' && (
                                            <p className="text-sm text-neutral-600">
                                                {currentChat.participants?.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <MoreVertical className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={`max-w-lg ${message.isOwn ? 'text-right' : 'text-left'}`}>
                                        {!message.isOwn && currentChat.type === 'group' && (
                                            <p className="text-xs text-neutral-500 mb-1 px-1">
                                                {message.senderName}
                                            </p>
                                        )}
                                        <div
                                            className={`inline-block px-4 py-3 rounded-2xl ${message.isOwn
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white text-neutral-900 border border-neutral-200'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-1 px-1">
                                            {message.timestamp.toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-neutral-200">
                            <div className="flex items-end gap-2">
                                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <Smile className="w-5 h-5 text-neutral-600" />
                                </button>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    rows={1}
                                    className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`p-3 rounded-lg transition-colors ${newMessage.trim()
                                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-neutral-50">
                        <div className="text-center">
                            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-600">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
