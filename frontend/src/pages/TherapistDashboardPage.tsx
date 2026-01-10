import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    DollarSign,
    Users,
    Video,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapistCrisisAlerts } from '../hooks/useTherapistCrisisAlerts';

interface Appointment {
    id: string;
    patientName: string;
    scheduledAt: Date;
    type: string;
    status: string;
}

export const TherapistDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { crisisAlerts, acceptCrisisSession, dismissAlert } = useTherapistCrisisAlerts();

    // Fetch appointments from backend
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        // TODO: Replace with actual API call to Prisma backend
        // For now, using mock data
        const mockAppointments: Appointment[] = [
            {
                id: '1',
                patientName: 'Anonymous User #4521',
                scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
                type: 'Video',
                status: 'SCHEDULED'
            },
            {
                id: '2',
                patientName: 'Rahul M.',
                scheduledAt: new Date(Date.now() + 7200000), // 2 hours from now
                type: 'Audio',
                status: 'SCHEDULED'
            }
        ];
        setAppointments(mockAppointments);
    };

    const handleJoinVideo = (appointmentId: string) => {
        // "Wizard of Oz" - Opens Google Meet for demo
        window.open('https://meet.google.com/new', '_blank');
    };

    const handleAcceptCrisis = (alertId: string) => {
        acceptCrisisSession(alertId);
        // Open video room
        window.open('https://meet.google.com/new', '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading text-primary-900 mb-2">Therapist Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Dr. Sarah. You have {crisisAlerts.length} emergency alerts pending.</p>
                </div>

                {/* Crisis Alerts - Top Priority */}
                {crisisAlerts.length > 0 && (
                    <div className="mb-8 space-y-4">
                        {crisisAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                className="card border-2 border-danger-400 bg-danger-50 shadow-lg"
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <motion.div
                                            className="p-3 bg-danger-200 rounded-full"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <AlertCircle className="w-8 h-8 text-danger-700" />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-heading text-danger-900 mb-2 flex items-center gap-2">
                                                🚨 Emergency Session Request
                                                <span className="text-sm px-2 py-1 bg-danger-600 text-white rounded-full">
                                                    Crisis Level {alert.crisisLevel}/10
                                                </span>
                                            </h3>
                                            <p className="text-danger-800 mb-3">
                                                {alert.patientInfo}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-danger-700">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                                {alert.keywords && alert.keywords.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        Detected: {alert.keywords.slice(0, 2).join(', ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptCrisis(alert.id)}
                                            className="px-6 py-3 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors shadow-md flex items-center gap-2"
                                        >
                                            <Video className="w-5 h-5" />
                                            Accept Emergency Session
                                        </button>
                                        <button
                                            onClick={() => dismissAlert(alert.id)}
                                            className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            title="Dismiss (another therapist will handle)"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Live Queue */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-heading text-primary-900 flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary-600" />
                                Live Queue
                            </h2>
                            <span className="px-3 py-1 bg-primary-200 text-primary-800 rounded-full text-sm font-medium">
                                3 waiting
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                                <p className="font-medium text-primary-900">Anonymous #7834</p>
                                <p className="text-sm text-gray-600">Waiting 12 minutes</p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                                <p className="font-medium text-primary-900">Priya K.</p>
                                <p className="text-sm text-gray-600">Waiting 5 minutes</p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                                <p className="font-medium text-primary-900">Anonymous #2341</p>
                                <p className="text-sm text-gray-600">Waiting 2 minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Earnings */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-heading text-primary-900 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-primary-600" />
                                This Month
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-3xl font-bold text-primary-900">₹45,200</p>
                                <p className="text-sm text-gray-600">23 sessions completed</p>
                            </div>
                            <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-600 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">68% of monthly target</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card">
                        <h2 className="text-xl font-heading text-primary-900 mb-4">Quick Stats</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Avg. Session Rating</span>
                                <span className="font-bold text-primary-900">4.9 ⭐</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Response Time</span>
                                <span className="font-bold text-primary-900">3.2 min</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Completion Rate</span>
                                <span className="font-bold text-primary-900">98%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-heading text-primary-900 flex items-center gap-2">
                            <Calendar className="w-7 h-7 text-primary-600" />
                            Upcoming Appointments
                        </h2>
                        <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                            View All →
                        </button>
                    </div>

                    {appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No upcoming appointments</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-secondary-200 rounded-lg">
                                            {appointment.type === 'Video' ? (
                                                <Video className="w-6 h-6 text-secondary-700" />
                                            ) : (
                                                <Users className="w-6 h-6 text-secondary-700" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-primary-900">{appointment.patientName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(appointment.scheduledAt).toLocaleString('en-IN', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary-200 text-primary-800 rounded-full text-sm">
                                            {appointment.type}
                                        </span>
                                        <button
                                            onClick={() => handleJoinVideo(appointment.id)}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                                        >
                                            <Video className="w-4 h-4" />
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
