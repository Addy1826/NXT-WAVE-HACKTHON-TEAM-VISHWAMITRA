import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
    _id: string;
    patientId: {
        _id: string;
        name: string;
        avatar?: string;
    };
    date: string;
    time: string;
    type: 'video' | 'chat';
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    meetingLink?: string;
}

export const TherapistAppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/appointments/therapist', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.length === 0) {
                setAppointments([
                    {
                        _id: '1',
                        patientId: { _id: 'p1', name: 'Emily R.', avatar: 'https://ui-avatars.com/api/?name=Emily+R&background=random' },
                        date: new Date().toISOString(),
                        time: '10:00 AM',
                        type: 'video',
                        status: 'confirmed',
                        meetingLink: 'https://meet.jit.si/mental-health-1'
                    },
                    {
                        _id: '2',
                        patientId: { _id: 'p2', name: 'Michael B.', avatar: 'https://ui-avatars.com/api/?name=Michael+B&background=random' },
                        date: new Date(Date.now() + 86400000).toISOString(),
                        time: '2:30 PM',
                        type: 'chat',
                        status: 'pending'
                    }
                ]);
            } else {
                setAppointments(response.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Fallback mock data for demo if API fails
            setAppointments([
                {
                    _id: '1',
                    patientId: { _id: 'p1', name: 'Emily R.', avatar: 'https://ui-avatars.com/api/?name=Emily+R&background=random' },
                    date: new Date().toISOString(),
                    time: '10:00 AM',
                    type: 'video',
                    status: 'confirmed',
                    meetingLink: 'https://meet.jit.si/mental-health-1'
                },
                {
                    _id: '2',
                    patientId: { _id: 'p2', name: 'Michael B.', avatar: 'https://ui-avatars.com/api/?name=Michael+B&background=random' },
                    date: new Date(Date.now() + 86400000).toISOString(),
                    time: '2:30 PM',
                    type: 'chat',
                    status: 'pending'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            // Check if meeting link is needed for confirmation
            const meetingLink = status === 'confirmed' ? `https://meet.jit.si/mental-health-${id}` : undefined;

            await axios.patch(`http://localhost:3001/api/appointments/${id}/status`,
                { status, meetingLink },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAppointments();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="p-8">Loading appointments...</div>;

    return (
        <div className="py-6 px-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {appointments.map((appt) => (
                        <li key={appt._id}>
                            <div className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={appt.patientId.avatar || `https://ui-avatars.com/api/?name=${appt.patientId.name}`}
                                                alt={appt.patientId.name}
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-teal-600 truncate">{appt.patientId.name}</p>
                                                <div className="flex text-sm text-gray-500 mt-1">
                                                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>{new Date(appt.date).toLocaleDateString()}</p>
                                                    <Clock className="flex-shrink-0 mx-1.5 h-4 w-4 text-gray-400" />
                                                    <p>{appt.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                            </span>
                                            <div className="ml-4 flex space-x-2">
                                                {appt.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(appt._id, 'confirmed')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <CheckCircle className="h-6 w-6" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(appt._id, 'cancelled')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <XCircle className="h-6 w-6" />
                                                        </button>
                                                    </>
                                                )}
                                                {appt.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => navigate(`/therapist/session/${appt._id}`)}
                                                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                    >
                                                        {appt.type === 'video' ? <Video className="h-5 w-5 mr-1" /> : <MessageSquare className="h-5 w-5 mr-1" />}
                                                        Join
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {appointments.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No appointments found.</div>
                    )}
                </ul>
            </div>
        </div>
    );
};
