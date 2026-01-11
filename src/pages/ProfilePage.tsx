import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Clock, Calendar, Activity, Save, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'I am on a journey to better mental health.',
        birthdate: '',
        gender: 'prefer_not_to_say'
    });

    const handleSave = () => {
        // In a real app, this would call an API to update the user profile
        console.log('Saving profile:', formData);
        setIsEditing(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">

            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-slate-800">{user?.name}</h1>
                    <p className="text-slate-500 text-lg flex items-center justify-center md:justify-start gap-2 mt-2">
                        <Shield className="w-4 h-4" />
                        {user?.role === 'therapist' ? 'Licensed Therapist' : 'Member'}
                    </p>
                    <p className="text-slate-400 mt-1">Member since {new Date().getFullYear()}</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-teal-600" />
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                                    />
                                    <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        disabled={true} // Email usually not editable directly
                                        value={formData.email}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Birthdate</label>
                                <input
                                    type="date"
                                    disabled={!isEditing}
                                    value={formData.birthdate}
                                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                <select
                                    disabled={!isEditing}
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non_binary">Non-binary</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Key className="w-5 h-5 text-teal-600" />
                            Security
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">Password</p>
                                <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                            </div>
                            <button className="text-teal-600 font-medium hover:text-teal-700">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-teal-600" />
                            My Journey
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">12</p>
                                    <p className="text-sm text-slate-600">Hours of Therapy</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl">
                                <div className="p-3 bg-teal-100 rounded-lg text-teal-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">5</p>
                                    <p className="text-sm text-slate-600">Sessions Attended</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
