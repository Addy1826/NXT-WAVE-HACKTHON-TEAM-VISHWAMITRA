import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar as CalendarIcon,
    DollarSign,
    Users,
    Video,
    Clock,
    CheckCircle,
    XCircle,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapistCrisisAlerts, type CrisisAlert } from '../hooks/useTherapistCrisisAlerts.ts';

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    scheduledAt: Date;
    durationMinutes: number;
    type: 'VIDEO_CALL' | 'AUDIO_CALL' | 'CHAT_ONLY';
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

interface DashboardStats {
    upcomingSessions: number;
    pendingMessages: number;
    totalEarningsINR: number;
    completedThisMonth: number;
}

interface ActivityItem {
    id: string;
    type: 'SESSION_COMPLETED' | 'MESSAGE_SENT' | 'APPOINTMENT_APPROVED';
    description: string;
    timestamp: Date;
}

export const TherapistDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        upcomingSessions: 0,
        pendingMessages: 0,
        totalEarningsINR: 0,
        completedThisMonth: 0
    });
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const { crisisAlerts, acceptCrisisSession, dismissAlert } = useTherapistCrisisAlerts();

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        // TODO: Replace with actual API calls
        // Mock data for demonstration
        const mockAppointments: Appointment[] = [
            {
                id: '1',
                patientId: 'p1',
                patientName: 'Rahul M.',
                scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
                durationMinutes: 50,
                type: 'VIDEO_CALL',
                status: 'CONFIRMED'
            },
            {
                id: '2',
                patientId: 'p2',
                patientName: 'Priya S.',
                scheduledAt: new Date(Date.now() + 7200000), // 2 hours
                durationMinutes: 50,
                type: 'VIDEO_CALL',
                status: 'CONFIRMED'
            },
            {
                id: '3',
                patientId: 'p3',
                patientName: 'Anonymous #4521',
                scheduledAt: new Date(Date.now() + 14400000), // 4 hours
                durationMinutes: 30,
                type: 'CHAT_ONLY',
                status: 'PENDING'
            }
        ];

        const mockStats: DashboardStats = {
            upcomingSessions: 5,
            pendingMessages: 3,
            totalEarningsINR: 45000,
            completedThisMonth: 28
        };

        const mockActivity: ActivityItem[] = [
            {
                id: '1',
                type: 'SESSION_COMPLETED',
                description: 'Completed 50min session with Aditya K.',
                timestamp: new Date(Date.now() - 3600000) // 1 hour ago
            },
            {
                id: '2',
                type: 'MESSAGE_SENT',
                description: 'Replied to Neha P.\'s message',
                timestamp: new Date(Date.now() - 7200000) // 2 hours ago
            },
            {
                id: '3',
                type: 'APPOINTMENT_APPROVED',
                description: 'Approved new booking from Rajesh T.',
                timestamp: new Date(Date.now() - 10800000) // 3 hours ago
            }
        ];

        setAppointments(mockAppointments);
        setStats(mockStats);
        setRecentActivity(mockActivity);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatRelativeTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (minutes < 60) return `${minutes} mins ago`;
        if (hours < 24) return `${hours} hours ago`;
        return 'Yesterday';
    };

    const handleJoinSession = (appointmentId: string) => {
        navigate(`/therapist/session/${appointmentId}`);
    };

    const handleAcceptCrisis = (alertId: string) => {
        acceptCrisisSession(alertId);
        // TODO: Navigate to emergency session room
    };

    const getTodaysAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return appointments.filter(apt => {
            const aptDate = new Date(apt.scheduledAt);
            return aptDate >= today && aptDate < tomorrow;
        });
    };

    const todaysAppointments = getTodaysAppointments();

    return (
        <div className="min-h-screen bg-neutral-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading text-neutral-900 mb-2">Dashboard</h1>
                    <p className="text-neutral-600">
                        Welcome back, Dr. Sarah. {crisisAlerts.length > 0 && (
                            <span className="text-danger-600 font-semibold">
                                You have {crisisAlerts.length} emergency alert{crisisAlerts.length > 1 ? 's' : ''} pending.
                            </span>
                        )}
                    </p>
                </div>

                {/* Crisis Alerts - Top Priority */}
                {crisisAlerts.length > 0 && (
                    <div className="space-y-4 mb-6">
                        {crisisAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                className="bg-danger-50 border-2 border-danger-400 rounded-xl p-6 shadow-lg"
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
                                            <p className="text-danger-800 mb-4">{alert.message}</p>
                                            <p className="text-sm text-danger-700">
                                                User: {alert.userId} • {new Date(alert.timestamp).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptCrisis(alert.id)}
                                            className="px-4 py-2 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors flex items-center gap-2"
                                        >
                                            <Video className="w-4 h-4" />
                                            Accept & Join
                                        </button>
                                        <button
                                            onClick={() => dismissAlert(alert.id)}
                                            className="px-4 py-2 bg-white text-danger-700 border border-danger-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ y: -4 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <CalendarIcon className="w-6 h-6 text-primary-600" />
                            </div>
                            <span className="text-2xl font-bold text-primary-600">{stats.upcomingSessions}</span>
                        </div>
                        <h3 className="text-neutral-700 font-medium">Upcoming Sessions</h3>
                        <p className="text-sm text-neutral-500 mt-1">Next 7 days</p>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ y: -4 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary-100 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-secondary-600" />
                            </div>
                            <span className="text-2xl font-bold text-secondary-600">{stats.pendingMessages}</span>
                        </div>
                        <h3 className="text-neutral-700 font-medium">Pending Messages</h3>
                        <p className="text-sm text-neutral-500 mt-1">Unread chats</p>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ y: -4 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold text-green-600">₹{stats.totalEarningsINR.toLocaleString('en-IN')}</span>
                        </div>
                        <h3 className="text-neutral-700 font-medium">Monthly Earnings</h3>
                        <p className="text-sm text-neutral-500 mt-1">This month</p>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ y: -4 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-primary-600" />
                            </div>
                            <span className="text-2xl font-bold text-primary-600">{stats.completedThisMonth}</span>
                        </div>
                        <h3 className="text-neutral-700 font-medium">Completed Sessions</h3>
                        <p className="text-sm text-neutral-500 mt-1">This month</p>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Appointments */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading text-neutral-900">Today's Appointments</h2>
                            <button
                                onClick={() => navigate('/therapist/appointments')}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                                View All →
                            </button>
                        </div>

                        {todaysAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                <p className="text-neutral-500">No appointments scheduled for today</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todaysAppointments.map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary-100 rounded-lg">
                                                <Clock className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-neutral-900">{apt.patientName}</h3>
                                                <p className="text-sm text-neutral-600">
                                                    {formatTime(apt.scheduledAt)} • {apt.durationMinutes} min • {apt.type.replace('_', ' ')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {apt.status === 'PENDING' && (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                                    Pending
                                                </span>
                                            )}
                                            {apt.status === 'CONFIRMED' && (
                                                <button
                                                    onClick={() => navigate(`/session/${apt.id}`)}
                                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
                                                >
                                                    <Video className="w-4 h-4" />
                                                    Join
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-2xl font-heading text-neutral-900 mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        {activity.type === 'SESSION_COMPLETED' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                        {activity.type === 'MESSAGE_SENT' && <MessageSquare className="w-4 h-4 text-primary-600" />}
                                        {activity.type === 'APPOINTMENT_APPROVED' && <CheckCircle className="w-4 h-4 text-primary-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-neutral-900">{activity.description}</p>
                                        <p className="text-xs text-neutral-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/therapist/patients')}
                        className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left group"
                    >
                        <Users className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-neutral-900 mb-1">My Patients</h3>
                        <p className="text-sm text-neutral-600">View all active patients</p>
                    </button>

                    <button
                        onClick={() => navigate('/therapist/messages')}
                        className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left group"
                    >
                        <MessageSquare className="w-8 h-8 text-secondary-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-neutral-900 mb-1">Messages</h3>
                        <p className="text-sm text-neutral-600">{stats.pendingMessages} unread messages</p>
                    </button>

                    <button
                        onClick={() => navigate('/therapist/earnings')}
                        className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left group"
                    >
                        <TrendingUp className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-neutral-900 mb-1">Earnings</h3>
                        <p className="text-sm text-neutral-600">View financial analytics</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
