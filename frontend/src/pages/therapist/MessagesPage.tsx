import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Send, FileText } from 'lucide-react';

interface Patient {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

interface Message {
    id: string;
    sender: 'me' | 'other';
    text?: string;
    time: string;
    attachment?: {
        name: string;
        size: string;
        type: 'pdf' | 'image';
    };
}

export const MessagesPage: React.FC = () => {
    // Mock Data for Patients List
    const patients: Patient[] = [
        { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=10B981&color=fff', lastMessage: 'Thank you for the session!', time: '10:20 AM', unread: 0, online: true },
        { id: '2', name: 'Bob Williams', avatar: 'https://ui-avatars.com/api/?name=Bob+Williams&background=F59E0B&color=fff', lastMessage: "I've reviewed the exercises.", time: 'Yesterday', unread: 2, online: false },
        { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=3B82F6&color=fff', lastMessage: 'Feeling a bit better today.', time: 'Yesterday', unread: 1, online: false },
        { id: '4', name: 'Diana Miller', avatar: 'https://ui-avatars.com/api/?name=Diana+Miller&background=EF4444&color=fff', lastMessage: 'Can we reschedule next week?', time: 'Mon', unread: 0, online: true },
    ];

    const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
    const [messageInput, setMessageInput] = useState('');

    // Mock Data for Active Chat
    const chatHistory: Message[] = [
        { id: '1', sender: 'me', text: 'Hi Alice, how are you feeling today after our last session?', time: '10:00 AM' },
        { id: '2', sender: 'other', text: "I'm doing much better, thank you! I've been trying the mindfulness exercises.", time: '10:05 AM' },
        { id: '3', sender: 'me', text: "That's wonderful to hear! Remember consistency is key. I've attached a new worksheet on managing stress.", time: '10:10 AM' },
        { id: '4', sender: 'me', attachment: { name: 'Stress_Management_Worksheet.pdf', size: '2.5 MB', type: 'pdf' }, time: '10:10 AM' },
        { id: '5', sender: 'other', text: 'Thank you so much! I\'ll take a look at it right away. Your support means a lot.', time: '10:15 AM' },
        { id: '6', sender: 'me', text: "You're very welcome, Alice. Keep up the great work, and don't hesitate to reach out if you need anything.", time: '10:20 AM' },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
            {/* Sidebar - Patient List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Patients</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {patients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${selectedPatient.id === patient.id ? 'bg-blue-50 border-blue-500' : 'border-transparent'}`}
                        >
                            <div className="relative">
                                <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full" />
                                {patient.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm font-semibold truncate ${selectedPatient.id === patient.id ? 'text-blue-900' : 'text-gray-900'}`}>{patient.name}</h3>
                                    <span className="text-xs text-gray-400">{patient.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate max-w-[140px]">{patient.lastMessage}</p>
                                    {patient.unread > 0 && (
                                        <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">{patient.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center">
                        <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{selectedPatient.name}</h2>
                            <p className="text-xs text-green-500 font-medium flex items-center">
                                {selectedPatient.online ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Phone className="w-5 h-5 text-gray-600" /></button>
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Video className="w-5 h-5 text-gray-600" /></button>
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    {chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                                {msg.text && (
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me'
                                            ? 'bg-gray-100 text-gray-800 rounded-br-none'
                                            : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}>
                                        {msg.text}
                                    </div>
                                )}

                                {msg.attachment && (
                                    <div className="mt-2 flex items-center bg-white border border-gray-200 rounded-lg p-3 w-64 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                                            <FileText className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 truncate">{msg.attachment.name}</p>
                                            <p className="text-xs text-gray-500">{msg.attachment.size}</p>
                                        </div>
                                    </div>
                                )}

                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
                            placeholder="Type your message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button
                            className={`p-2 rounded-lg transition-all ${messageInput ? 'bg-blue-500 text-white shadow-md transform scale-100' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
