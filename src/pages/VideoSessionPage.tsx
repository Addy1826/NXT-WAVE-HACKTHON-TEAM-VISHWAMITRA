import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Phone, Shield, Wifi, MoreVertical, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export const VideoSessionPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const jitsiContainer = useRef<HTMLDivElement>(null);
    const jitsiApi = useRef<any>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Load Jitsi Meet API script
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;

        script.onload = () => {
            initializeJitsi();
        };

        script.onerror = () => {
            setError(true);
            setIsConnecting(false);
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup: dispose Jitsi instance and remove script
            if (jitsiApi.current) {
                jitsiApi.current.dispose();
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const initializeJitsi = () => {
        if (!jitsiContainer.current || !window.JitsiMeetExternalAPI) {
            setError(true);
            setIsConnecting(false);
            return;
        }

        const roomName = `mindora-session-${sessionId}`;
        const domain = "meet.jit.si";

        const options = {
            roomName: roomName,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainer.current,
            userInfo: {
                displayName: user?.name || "Guest User"
            },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: true,
                disableDeepLinking: true,
                backgroundAlpha: 0.5,
                toolbarButtons: [
                    'camera',
                    'chat',
                    'closedcaptions',
                    'desktop',
                    'etherpad',
                    'fullscreen',
                    'hangup',
                    'microphone',
                    'raisehand',
                    'settings',
                    'tileview',
                    'toggle-camera',
                    'videoquality'
                ]
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_BACKGROUND: '#0f172a',
                DISABLE_VIDEO_BACKGROUND: true,
            }
        };

        try {
            jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

            jitsiApi.current.addEventListener("videoConferenceJoined", () => {
                setIsConnecting(false);
            });

            // Listen for when the user leaves the call
            jitsiApi.current.addEventListener("readyToClose", () => {
                handleEndSession();
            });
        } catch (err) {
            console.error("Jitsi initialization error:", err);
            setError(true);
            setIsConnecting(false);
        }
    };

    const handleEndSession = () => {
        if (jitsiApi.current) {
            jitsiApi.current.dispose();
        }
        // Navigate back based on user role
        if (user?.role === "therapist") {
            navigate("/therapist/dashboard");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-900 flex flex-col overflow-hidden relative">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Premium Header */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 z-20 relative shadow-2xl shadow-black/50"
            >
                <div className="flex items-center gap-4 sm:gap-6">
                    <button
                        onClick={handleEndSession}
                        className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-300 hover:text-white border border-white/5 group relative overflow-hidden"
                        title="Leave Session"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="hidden sm:block h-8 w-[1px] bg-white/10"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-white font-heading font-black tracking-tight text-lg">Therapy Session</h1>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">Live</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> E2E Encrypted</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span className="flex items-center gap-1 truncate max-w-[120px] sm:max-w-xs cursor-pointer hover:text-slate-300 transition-colors">ID: {sessionId}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-300 bg-white/5 mr-2">
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Connection Stable
                    </div>

                    <button className="hidden sm:flex p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-300 hover:text-white border border-white/5">
                        <Maximize2 className="w-4 h-4" />
                    </button>

                    <button className="hidden sm:flex p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-300 hover:text-white border border-white/5">
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleEndSession}
                        className="px-4 sm:px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 hover:text-red-400 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform"></span>
                        <Phone className="w-4 h-4 rotate-[135deg] relative z-10" />
                        <span className="relative z-10 hidden sm:inline">End Session</span>
                        <span className="relative z-10 sm:hidden">Leave</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Video Area */}
            <div className="flex-1 w-full relative z-10 p-2 sm:p-4 bg-transparent flex flex-col items-center justify-center">

                {/* Connecting State */}
                {isConnecting && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-4 sm:inset-6 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center z-30 flex-1 shadow-2xl"
                    >
                        <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                            <svg className="animate-spin text-primary-500 w-16 h-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <Shield className="w-6 h-6 text-white absolute" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 font-heading">Establishing Secure Connection</h2>
                        <p className="text-slate-400 font-medium">Please wait while we set up your encrypted session...</p>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-4 sm:inset-6 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center z-30 shadow-2xl text-center px-4"
                    >
                        <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <Wifi className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 font-heading">Connection Failed</h2>
                        <p className="text-slate-400 font-medium max-w-sm mb-8 leading-relaxed">
                            We couldn't connect to the secure video server. This might be due to a network drop or firewall restriction.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/25"
                        >
                            Retry Connection
                        </button>
                    </motion.div>
                )}

                {/* Actual Jitsi Wrapper */}
                <div
                    className={`w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/50 transition-all duration-1000 ${isConnecting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                >
                    <div
                        ref={jitsiContainer}
                        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                    />
                </div>
            </div>
        </div>
    );
};
