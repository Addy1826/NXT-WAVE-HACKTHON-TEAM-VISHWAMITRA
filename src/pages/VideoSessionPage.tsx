import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Phone } from "lucide-react";

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

    useEffect(() => {
        // Load Jitsi Meet API script
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => initializeJitsi();
        document.body.appendChild(script);

        return () => {
            // Cleanup: dispose Jitsi instance and remove script
            if (jitsiApi.current) {
                jitsiApi.current.dispose();
            }
            document.body.removeChild(script);
        };
    }, []);

    const initializeJitsi = () => {
        if (!jitsiContainer.current || !window.JitsiMeetExternalAPI) return;

        const roomName = `serenity-session-${sessionId}`;
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
                prejoinPageEnabled: false,
                disableDeepLinking: true
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    "microphone",
                    "camera",
                    "closedcaptions",
                    "desktop",
                    "fullscreen",
                    "fodeviceselection",
                    "hangup",
                    "chat",
                    "recording",
                    "settings",
                    "raisehand",
                    "videoquality",
                    "tileview",
                    "mute-everyone"
                ],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false
            }
        };

        jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

        // Listen for when the user leaves the call
        jitsiApi.current.addEventListener("readyToClose", () => {
            handleEndSession();
        });
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
        <div className="h-screen w-screen bg-neutral-900 flex flex-col">
            {/* Header */}
            <div className="bg-neutral-800 px-6 py-4 flex items-center justify-between border-b border-neutral-700">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleEndSession}
                        className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-300 hover:text-white"
                        title="Leave Session"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-white font-semibold">Therapy Session</h1>
                        <p className="text-sm text-neutral-400">Session ID: {sessionId}</p>
                    </div>
                </div>
                <button
                    onClick={handleEndSession}
                    className="px-6 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Phone className="w-4 h-4" />
                    End Session
                </button>
            </div>

            {/* Jitsi Container */}
            <div
                ref={jitsiContainer}
                className="flex-1 w-full"
                style={{ minHeight: 0 }}
            />
        </div>
    );
};
