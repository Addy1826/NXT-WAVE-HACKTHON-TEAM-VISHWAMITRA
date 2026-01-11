import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Mic, Video, PhoneOff, Upload, Save,
    Lock, MoreVertical
} from 'lucide-react';

export const SessionPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const [notes, setNotes] = useState('');

    // Construct Jitsi URL
    // ensure unique room name, usually appName + appointmentId
    const roomName = `mental-health-app-${appointmentId}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    const handleEndCall = () => {
        if (window.confirm("Are you sure you want to end the session?")) {
            navigate('/therapist/appointments');
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] bg-gray-50 p-6 flex gap-6 overflow-hidden">
            {/* Main Video Area */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Session with Emily R.</h2>
                        <span className="text-sm text-gray-500 flex items-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            00:12:45
                        </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Lock className="w-4 h-4 mr-1" />
                        Secure Connection
                    </div>
                </div>

                {/* Video Container (Iframe) */}
                <div className="flex-1 bg-gray-900 relative relative group">
                    <iframe
                        src={`${jitsiUrl}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=['microphone','camera','desktop','fullscreen','fodeviceselection','hangup','profile','chat','settings','raisehand','videoquality','filmstrip','feedback','stats','shortcuts','tileview','videobackgroundblur','download','help','mute-everyone','e2ee']`}
                        width="100%"
                        height="100%"
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        className="w-full h-full border-none"
                        title="Video Session"
                    ></iframe>

                    {/* Custom Overlay Controls (Visual Only - Jitsi has its own, but matching design aesthetics) */}
                    {/* Note: In a real Jitsi SDK integration, these would function. For iframe, we might hide this or use it as auxiliary */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {/* These are purely decorative here since we stick to iframe for simplicity, 
                           but user requested the design match. 
                           Pointer events none so clicks pass through to iframe if needed, 
                           or we would need Jitsi API to control calls from outside.
                        */}
                    </div>
                </div>

                {/* Footer Controls (Custom Application Controls) */}
                <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-center items-center gap-4">
                    <button className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                        <Mic className="w-6 h-6" />
                    </button>
                    <button className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                        <Video className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 transition-colors"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-96 flex flex-col gap-6">
                {/* Session Notes */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col flex-1 h-3/5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Session Notes</h3>
                        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </div>
                    <textarea
                        className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-sm leading-relaxed"
                        placeholder="Type session notes here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                    <button className="mt-4 w-full py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center">
                        <Save className="w-4 h-4 mr-2" />
                        Save Notes
                    </button>
                </div>

                {/* Share Resources */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-2/5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Share Resources</h3>
                    <p className="text-sm text-gray-500 mb-6 font-light">
                        Share exercises, worksheets, or helpful guides with your patient.
                    </p>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl flex-1 flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                            <Upload className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Upload & Share File</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
