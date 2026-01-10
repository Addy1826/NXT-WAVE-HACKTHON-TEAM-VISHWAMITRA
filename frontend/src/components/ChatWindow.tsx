import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Mic, Phone, Video } from 'lucide-react';
import api from '../services/api';

interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name: string;
        avatar?: string;
    } | string; // string for 'bot'
    type: string;
    createdAt: string;
    metadata?: any;
}

interface ChatWindowProps {
    conversationId: string;
    onVideoCall?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onVideoCall }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user, token } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Socket.IO
        // Initialize Socket.IO
        const newSocket = io('http://localhost:5000', {
            auth: { token },
            transports: ['websocket']
        });

        setSocket(newSocket);

        // Load initial messages
        fetchMessages();

        // Socket event listeners
        newSocket.on('chat:message', (message: Message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        return () => {
            newSocket.disconnect();
        };
    }, [conversationId, token]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/conversations/${conversationId}/messages`);
            setMessages(response.data.reverse()); // Assuming API returns newest first
            scrollToBottom();
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            conversationId,
            message: newMessage,
            type: 'text'
        };

        socket.emit('chat:message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Chat</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={onVideoCall}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                    >
                        <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                        <Phone className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender && typeof msg.sender === 'object' ? msg.sender._id === user?.id : false;
                    const isBot = msg.sender === 'bot' || (msg.sender && typeof msg.sender === 'object' && msg.sender._id === 'bot');

                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : isBot
                                        ? 'bg-green-100 text-green-900 rounded-bl-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.content}</p>
                                {msg.metadata?.suggestions && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.metadata.suggestions.map((suggestion: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setNewMessage(suggestion)}
                                                className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded-full transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex space-x-2">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <Mic className="h-5 w-5" />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};
