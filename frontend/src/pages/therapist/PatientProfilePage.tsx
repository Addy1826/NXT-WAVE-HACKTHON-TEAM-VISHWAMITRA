import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Calendar, Clock,
    Activity, FileText, ChevronLeft, MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data Interfaces
interface PatientProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    occupation: string;
    address: string;
    avatar: string;
    joinDate: string;
    status: 'Active' | 'Inactive';
    diagnosis: string[];
    medications: string[];
    nextAppointment: string;
    notes: Note[];
    moodHistory: { date: string; score: number }[];
}

interface Note {
    id: string;
    date: string;
    content: string;
    author: string;
}

export const PatientProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            // Mock Data Generation based on ID (to make it dynamic-ish)
            setPatient({
                id: id || '1',
                name: 'Sarah Chen', // Hardcoded name for demo, normally would match ID
                email: 'sarah.chen@example.com',
                phone: '+1 (555) 123-4567',
                age: 28,
                gender: 'Female',
                occupation: 'Graphic Designer',
                address: '123 Wellness Ave, San Francisco, CA',
                avatar: `https://ui-avatars.com/api/?name=Sarah+Chen&background=random`,
                joinDate: '2024-01-15',
                status: 'Active',
                diagnosis: ['Generalized Anxiety Disorder', 'Mild Depression'],
                medications: ['Sertraline 50mg', 'Melatonin 3mg'],
                nextAppointment: '2024-08-15 10:00 AM',
                notes: [
                    { id: 'n1', date: '2024-07-28', content: 'Patient reported feeling better after breathing exercises. Discussed work stress triggers.', author: 'Dr. Smith' },
                    { id: 'n2', date: '2024-07-14', content: 'Initial consultation. Signs of anxiety prominent. Recommended daily journaling.', author: 'Dr. Smith' }
                ],
                moodHistory: [
                    { date: 'Jul 1', score: 6 },
                    { date: 'Jul 5', score: 5 },
                    { date: 'Jul 10', score: 7 },
                    { date: 'Jul 15', score: 6 },
                    { date: 'Jul 20', score: 8 },
                    { date: 'Jul 25', score: 7 },
                    { date: 'Jul 30', score: 9 },
                ]
            });
            setLoading(false);
        }, 800);
    }, [id]);

    if (loading) return <div className="p-8 flex justify-center items-center h-full">Loading profile...</div>;
    if (!patient) return <div className="p-8">Patient not found</div>;

    return (
        <div className="py-8 px-8 bg-gray-50 min-h-screen">
            {/* Header / Navigation */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/therapist/patients')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Patient Management
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex flex-col items-center">
                            <img
                                src={patient.avatar}
                                alt={patient.name}
                                className="h-32 w-32 rounded-full object-cover mb-4 border-4 border-blue-50"
                            />
                            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                            <p className="text-gray-500">{patient.occupation}</p>
                            <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {patient.status}
                            </span>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{patient.address}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <User className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{patient.age} yrs • {patient.gender}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                <span>Joined: {new Date(patient.joinDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                            </button>
                        </div>
                    </div>

                    {/* Next Appointment Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-blue-500" />
                            Next Appointment
                        </h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-blue-900 font-medium">{patient.nextAppointment}</p>
                            <p className="text-blue-600 text-sm mt-1">Video Consultation</p>
                            <div className="mt-3 flex space-x-2">
                                <button className="flex-1 px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded border border-blue-200 hover:bg-blue-50">
                                    Reschedule
                                </button>
                                <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                                    Start Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Clinical Overview */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-blue-500" />
                            Clinical Overview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Diagnosis</h4>
                                <div className="flex flex-wrap gap-2">
                                    {patient.diagnosis.map((d, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Current Medications</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {patient.medications.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Mood Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Mood History (Last 30 Days)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={patient.moodHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 10]} hide />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Medical Notes */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                                Session Notes
                            </h3>
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
                                + Add Note
                            </button>
                        </div>

                        <div className="space-y-4">
                            {patient.notes.map((note) => (
                                <div key={note.id} className="border-l-4 border-blue-200 pl-4 py-1">
                                    <p className="text-gray-800 mb-1">{note.content}</p>
                                    <div className="text-xs text-gray-500 flex justify-between">
                                        <span>By {note.author}</span>
                                        <span>{new Date(note.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
