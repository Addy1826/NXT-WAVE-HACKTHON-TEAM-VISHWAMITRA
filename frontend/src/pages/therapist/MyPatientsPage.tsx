import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MessageSquare, Eye, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    lastSession: string;
    totalSessions: number;
    // Mocked fields for UI
    moodTrend?: 'Stable' | 'Fluctuating' | 'Declining';
    moodColor?: string;
}

export const MyPatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                // Updated port to 3001
                const response = await axios.get('http://localhost:3001/api/therapists/my-patients', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Enhance data with mock fields for the UI
                const enhancedPatients = response.data.map((p: Patient, index: number) => {
                    // Cyclic mock data based on index to ensure variety
                    const trends: ('Stable' | 'Fluctuating' | 'Declining')[] = ['Stable', 'Fluctuating', 'Declining'];
                    const trend = trends[index % 3];
                    let color = 'text-green-500';
                    if (trend === 'Fluctuating') color = 'text-yellow-500';
                    if (trend === 'Declining') color = 'text-red-500';

                    return {
                        ...p,
                        moodTrend: trend,
                        moodColor: color
                    };
                });

                setPatients(enhancedPatients);
            } catch (error) {
                console.error('Error fetching patients:', error);
                // Fallback mock data if API fails or returns empty (for development visualization)
                if (patients.length === 0) {
                    setPatients([
                        { _id: '1', name: 'Sarah Chen', email: 'sarah@example.com', lastSession: '2024-07-28', totalSessions: 5, moodTrend: 'Stable', moodColor: 'text-green-500' },
                        { _id: '2', name: 'David Lee', email: 'david@example.com', lastSession: '2024-07-25', totalSessions: 8, moodTrend: 'Fluctuating', moodColor: 'text-yellow-500' },
                        { _id: '3', name: 'Emily White', email: 'emily@example.com', lastSession: '2024-07-20', totalSessions: 3, moodTrend: 'Declining', moodColor: 'text-red-500' },
                        { _id: '4', name: 'Michael Brown', email: 'michael@example.com', lastSession: '2024-07-27', totalSessions: 12, moodTrend: 'Stable', moodColor: 'text-green-500' },
                        { _id: '5', name: 'Jessica Garcia', email: 'jessica@example.com', lastSession: '2024-07-23', totalSessions: 6, moodTrend: 'Fluctuating', moodColor: 'text-yellow-500' },
                        { _id: '6', name: 'Chris Rodriguez', email: 'chris@example.com', lastSession: '2024-07-26', totalSessions: 9, moodTrend: 'Stable', moodColor: 'text-green-500' },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) return <div className="p-8">Loading patients...</div>;

    return (
        <div className="py-8 px-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Management</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {patients.map((patient) => (
                    <div key={patient._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                        {/* Profile Header */}
                        <div className="flex items-center mb-4">
                            <img
                                className="h-16 w-16 rounded-full object-cover"
                                src={patient.avatar || `https://ui-avatars.com/api/?name=${patient.name}&background=random`}
                                alt={patient.name}
                            />
                            <div className="ml-4">
                                <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                                {/* Determine spacing or subtitle if needed, keeping it simple as per design */}
                            </div>
                        </div>

                        {/* Mood Trend */}
                        <div className="flex items-center mb-2">
                            <span className={`h-2.5 w-2.5 rounded-full mr-2 ${patient.moodColor?.replace('text-', 'bg-')}`}></span>
                            <span className="text-sm text-gray-600">
                                Mood Trend: <span className="font-medium text-gray-900">{patient.moodTrend}</span>
                            </span>
                        </div>

                        {/* Last Session */}
                        <div className="flex items-center mb-6 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last Session: {new Date(patient.lastSession).toLocaleDateString('en-CA')}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(`/therapist/patients/${patient._id}`)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                            </button>

                            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Chat
                            </button>

                            <button className="w-full flex items-center justify-center px-4 py-2 bg-[#9CAF88] hover:bg-[#8B9D77] text-white rounded-lg text-sm font-medium transition-colors">
                                <Clock className="h-4 w-4 mr-2" />
                                Schedule Follow-up
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
