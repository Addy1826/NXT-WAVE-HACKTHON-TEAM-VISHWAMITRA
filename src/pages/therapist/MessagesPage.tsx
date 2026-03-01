import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Send, FileText, Check, CheckCheck, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Patient {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    nextSession?: string;
}

interface Message {
    id: string;
    sender: 'me' | 'other';
    text?: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
    attachment?: {
        name: string;
        size: string;
        type: 'pdf' | 'image';
        url?: string;
    };
}

export const MessagesPage: React.FC = () => {
    const navigate = useNavigate();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Mock Data for Patients List
    const patients: Patient[] = [
        { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=10b981&color=fff', lastMessage: 'Thank you for the session!', time: '10:20 AM', unread: 0, online: true, nextSession: 'Tomorrow, 10:00 AM' },
        { id: '2', name: 'Bob Williams', avatar: 'https://ui-avatars.com/api/?name=Bob+Williams&background=f59e0b&color=fff', lastMessage: "I've reviewed the exercises.", time: 'Yesterday', unread: 2, online: false, nextSession: 'Aug 15, 2:00 PM' },
        { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=3b82f6&color=fff', lastMessage: 'Feeling a bit better today.', time: 'Yesterday', unread: 1, online: false },
        { id: '4', name: 'Diana Miller', avatar: 'https://ui-avatars.com/api/?name=Diana+Miller&background=ef4444&color=fff', lastMessage: 'Can we reschedule next week?', time: 'Mon', unread: 0, online: true },
    ];

    const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data for Active Chat
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { id: '1', sender: 'me', text: 'Hi Alice, how are you feeling today after our last session?', time: '10:00 AM', status: 'read' },
        { id: '2', sender: 'other', text: "I'm doing much better, thank you! I've been trying the mindfulness exercises.", time: '10:05 AM' },
        { id: '3', sender: 'me', text: "That's wonderful to hear! Remember consistency is key. I've attached a new worksheet on managing stress.", time: '10:10 AM', status: 'read' },
        { id: '4', sender: 'me', attachment: { name: 'Stress_Management_Worksheet.pdf', size: '2.5 MB', type: 'pdf' }, time: '10:10 AM', status: 'read' },
        { id: '5', sender: 'other', text: 'Thank you so much! I\'ll take a look at it right away. Your support means a lot.', time: '10:15 AM' },
        { id: '6', sender: 'me', text: "You're very welcome, Alice. Keep up the great work, and don't hesitate to reach out if you need anything before our next session.", time: '10:20 AM', status: 'read' },
    ]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, selectedPatient]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setChatHistory(prev => [...prev, newMessage]);
        setMessageInput('');

        // Simulate delivery and read receipt
        setTimeout(() => {
            setChatHistory(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg));
            setTimeout(() => {
                setChatHistory(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'read' } : msg));
            }, 1000);
        }, 500);
    };

    const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex h-[calc(100vh-100px)] bg-slate-50 gap-6 p-6">

            {/* Sidebar - Patient List */}
            <div className="w-80 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden shrink-0">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight mb-4">Messages</h2>
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`p-4 mx-2 my-1 rounded-2xl flex items-center cursor-pointer transition-all border ${selectedPatient.id === patient.id
                                ? 'bg-primary-50/50 border-primary-100 opacity-100'
                                : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-2xl shadow-sm border border-slate-100 object-cover" />
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${patient.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            </div>

                            <div className="ml-3 flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-sm font-bold truncate ${selectedPatient.id === patient.id ? 'text-primary-900' : 'text-slate-900'}`}>{patient.name}</h3>
                                    <span className={`text-[10px] font-bold ${patient.unread > 0 ? 'text-primary-600' : 'text-slate-400'}`}>{patient.time}</span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className={`text-xs truncate ${patient.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>{patient.lastMessage}</p>
                                    {patient.unread > 0 && (
                                        <span className="bg-primary-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm shadow-primary-500/20">{patient.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPatients.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm font-bold">No patients found.</div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">

                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate(`/therapist/patients/${selectedPatient.id}`)}>
                        <div className="relative">
                            <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-11 h-11 rounded-2xl shadow-sm border border-slate-100" />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${selectedPatient.online ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-heading font-black text-slate-900 group-hover:text-primary-600 transition-colors">{selectedPatient.name}</h2>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                {selectedPatient.nextSession ? (
                                    <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100"><Calendar className="w-3 h-3" /> Next: {selectedPatient.nextSession}</span>
                                ) : (
                                    <span className={selectedPatient.online ? 'text-emerald-500' : 'text-slate-400'}>{selectedPatient.online ? 'Online now' : 'Offline'}</span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 shadow-sm shadow-transparent hover:shadow-indigo-500/10" title="Start Video Session">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                            <Phone className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar relative">
                    {/* Secure Connection Notice */}
                    <div className="flex justify-center mb-8">
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 flex items-center gap-1.5 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> End-to-end encrypted connection
                        </span>
                    </div>

                    <AnimatePresence initial={false}>
                        {chatHistory.map((msg, index) => {
                            const isMe = msg.sender === 'me';
                            const showAvatar = index === 0 || chatHistory[index - 1].sender !== msg.sender;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                                >
                                    {!isMe && showAvatar && (
                                        <img src={selectedPatient.avatar} alt="Avatar" className="w-8 h-8 rounded-xl shrink-0 mr-3 self-end mb-1 border border-slate-200" />
                                    )}
                                    {!isMe && !showAvatar && <div className="w-11"></div>}

                                    <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>

                                        {msg.text && (
                                            <div className={`px-5 py-3.5 rounded-[20px] text-[15px] font-medium leading-relaxed shadow-sm ${isMe
                                                ? 'bg-slate-900 text-white rounded-br-sm'
                                                : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-[0_4px_15px_rgb(0,0,0,0.02)]'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        )}

                                        {msg.attachment && (
                                            <div className="bg-white border border-slate-200 rounded-2xl p-4 w-72 shadow-sm hover:shadow-md transition-all cursor-pointer group/att">
                                                <div className="flex gap-4 items-center">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${msg.attachment.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                                                        }`}>
                                                        {msg.attachment.type === 'pdf' ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate group-hover/att:text-primary-600 transition-colors">{msg.attachment.name}</p>
                                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{msg.attachment.size} • {msg.attachment.type.toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                                                {msg.time}
                                            </span>
                                            {isMe && msg.status && (
                                                <span className={`${msg.status === 'read' ? 'text-blue-500' : 'text-slate-400'}`}>
                                                    {msg.status === 'sent' ? <Check className="w-3 h-3" /> : <CheckCheck className="w-3.5 h-3.5" />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Message Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 z-10 w-full relative">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
                        <button type="button" className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors shrink-0 mb-0.5" title="Attach File">
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-sm">
                            <textarea
                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-400 px-4 py-3.5 min-h-[50px] max-h-32 resize-none custom-scrollbar"
                                placeholder="Type a secure message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                rows={1}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className={`p-3.5 rounded-xl transition-all shrink-0 mb-0.5 flex items-center justify-center ${messageInput.trim()
                                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
