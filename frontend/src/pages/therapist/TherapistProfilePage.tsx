import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Star, MapPin, Calendar, Clock, DollarSign, CheckCircle, Shield, X, Save } from 'lucide-react';

export const TherapistProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        bio: '',
        specialization: [] as string[],
        hourlyRate: 0,
        experienceYears: 0,
        isVerified: false
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        bio: '',
        specialization: [] as string[],
        hourlyRate: 0
    });

    // Initialize edit form when profile loads
    useEffect(() => {
        if (profile) {
            setEditForm({
                bio: profile.bio,
                specialization: profile.specialization,
                hourlyRate: profile.hourlyRate
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedProfile = { ...profile, ...editForm };
            await axios.post('http://localhost:3001/api/therapists/profile', updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/api/therapists/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8">Loading profile...</div>;

    // Mock Data for UI features not yet in backend
    const certifications = [
        "Licensed Professional Counselor (LPC)",
        "Certified EMDR Therapist",
        "National Certified Counselor (NCC)"
    ];

    const availability = [
        { day: 'Mon', slots: [] },
        { day: 'Tue', slots: [] },
        { day: 'Wed', slots: ['10', '11'] },
        { day: 'Thu', slots: [] },
        { day: 'Fri', slots: ['14'] },
        { day: 'Sat', slots: ['20'] }, // Highlighted in ref
        { day: 'Sun', slots: [] },
    ];

    const reviews = [
        { id: 1, name: "Sarah M.", date: "2 weeks ago", rating: 5, comment: "Dr. Reed has been incredibly supportive and insightful. She helped me through a very difficult period with her compassionate approach. Highly recommend!" },
        { id: 2, name: "John D.", date: "1 month ago", rating: 5, comment: "Professional and understanding. The sessions have given me practical tools to manage my anxiety. Very grateful for her guidance." },
        { id: 3, name: "Emily R.", date: "1 month ago", rating: 5, comment: "A truly transformative experience. Dr. Reed created a space where I felt heard and understood, leading to significant personal growth." },
        { id: 4, name: "Michael B.", date: "2 months ago", rating: 5, comment: "Dr. Reed's expertise in trauma therapy is exceptional. I felt safe and supported throughout my healing journey. Cannot thank her enough." }
    ];

    return (
        <div className="py-8 px-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6 flex items-start gap-6">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Dr. Evelyn Reed'}&background=random`}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name || "Dr. Evelyn Reed, PhD, LPC"}</h1>
                    <p className="text-gray-500 font-medium text-lg">Clinical Psychologist, Trauma Specialist</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Online & In-person</span>
                        <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" /> 5.0 (120 Reviews)</span>
                        {profile.isVerified && <span className="flex items-center text-green-600"><Shield className="w-4 h-4 mr-1" /> Verified</span>}
                    </div>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Biography */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Biography</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {isEditing ? (
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={6}
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    placeholder="Write a short biography..."
                                />
                            ) : (
                                profile.bio || "Dr. Evelyn Reed is a compassionate..."
                            )}
                        </p>
                    </div>

                    {/* Specializations & Certifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
                            <div className="flex flex-wrap gap-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={editForm.specialization.join(', ')}
                                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value.split(',').map(s => s.trim()) })}
                                        placeholder="Specializations (comma separated)"
                                    />
                                ) : (
                                    (profile.specialization.length > 0 ? profile.specialization : [
                                        "Cognitive Behavioral Therapy (CBT)",
                                        "Eye Movement Desensitization (EMDR)",
                                        "Anxiety & Stress Management",
                                        "Trauma-Informed Care",
                                        "Grief Counseling",
                                        "Couples Therapy"
                                    ]).map((spec, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-[#A8B597] text-white rounded-full text-sm font-medium shadow-sm">
                                            {spec}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
                            <ul className="space-y-2">
                                {certifications.map((cert, idx) => (
                                    <li key={idx} className="flex items-start text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{cert}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Availability Calendar (Mock Visual) */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Availability Calendar</h2>
                        {/* A simplified visual representation of a calendar month view focusing on dates */}
                        <div className="border border-gray-100 rounded-lg p-4">
                            <div className="grid grid-cols-7 gap-4 mb-2 text-center text-sm font-semibold text-gray-500">
                                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                            </div>
                            <div className="grid grid-cols-7 gap-4 text-center">
                                {/* First week (partial) */}
                                <div className="text-gray-300">29</div><div className="text-gray-300">30</div>
                                <div className="p-2 text-gray-700">1</div><div className="p-2 text-gray-700">2</div><div className="p-2 text-gray-700">3</div><div className="p-2 text-gray-700">4</div><div className="p-2 text-gray-700">5</div>

                                {/* Second week */}
                                <div className="p-2 text-gray-700">6</div><div className="p-2 text-gray-700">7</div><div className="p-2 text-gray-700 font-bold">8</div><div className="p-2 text-gray-700">9</div><div className="p-2 text-gray-700 font-bold">10</div><div className="p-2 text-gray-700">11</div><div className="p-2 text-gray-700">12</div>

                                {/* Third week */}
                                <div className="p-2 text-gray-700">13</div><div className="p-2 text-gray-700">14</div><div className="p-2 text-gray-700">15</div><div className="p-2 text-gray-700">16</div><div className="p-2 text-gray-700 font-bold">17</div><div className="p-2 text-gray-700">18</div><div className="p-2 text-gray-700">19</div>

                                {/* Fourth week - Active Selection */}
                                <div className="p-2 rounded bg-blue-500 text-white shadow-md font-bold">20</div>
                                <div className="p-2 text-gray-700">21</div><div className="p-2 text-gray-700">22</div><div className="p-2 text-gray-700">23</div><div className="p-2 text-gray-700 font-bold">24</div><div className="p-2 text-gray-700">25</div><div className="p-2 text-gray-700">26</div>
                            </div>
                            <div className="mt-6 flex gap-6 text-sm">
                                <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> Today</span>
                                <span className="flex items-center"><div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-2"></div> Available</span>
                                <span className="flex items-center"><div className="w-3 h-3 bg-white border border-gray-200 rounded-full mr-2"></div> Booked/Unavailable</span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Reviews & Ratings</h2>
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{review.name}</h3>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                                    <p className="text-xs text-gray-400 italic">Posted {review.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 width) - Fees & Services */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-8 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Fees & Services</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-gray-700">Individual Session (50 min)</span>
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <span className="text-gray-500 mr-1">$</span>
                                        <input
                                            type="number"
                                            className="w-20 p-1 border border-gray-300 rounded text-right"
                                            value={editForm.hourlyRate}
                                            onChange={(e) => setEditForm({ ...editForm, hourlyRate: Number(e.target.value) })}
                                        />
                                    </div>
                                ) : (
                                    <span className="font-bold text-blue-600">${profile.hourlyRate || 150}</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-gray-700">Couples Session (75 min)</span>
                                <span className="font-bold text-blue-600">${(profile.hourlyRate || 150) + 50}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-gray-700">Initial Consultation (30 min)</span>
                                <span className="font-bold text-green-600">Free</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Manage Pricing
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
