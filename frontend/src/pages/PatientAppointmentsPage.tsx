import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Award, MapPin, Video, MessageSquare, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Therapist {
    id: string;
    name: string;
    photo: string;
    specializations: string[];
    certifications: string[];
    experienceYears: number;
    rating: number;
    reviewCount: number;
    hourlyRateINR: number;
    location: string;
    bio: string;
}

export const PatientAppointmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSpec, setSelectedSpec] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock therapist data
    const therapists: Therapist[] = [
        {
            id: 't1',
            name: 'Dr. Sarah Mehta',
            photo: 'https://ui-avatars.com/api/?name=Sarah+Mehta&background=3b82f6&color=fff&size=200',
            specializations: ['Anxiety', 'Depression', 'CBT'],
            certifications: ['CBT Certified', 'Trauma Specialist'],
            experienceYears: 8,
            rating: 4.9,
            reviewCount: 142,
            hourlyRateINR: 2500,
            location: 'Mumbai',
            bio: 'Licensed Clinical Psychologist specializing in anxiety and depression treatment using evidence-based approaches.'
        },
        {
            id: 't2',
            name: 'Dr. Rajesh Kumar',
            photo: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=8b5cf6&color=fff&size=200',
            specializations: ['Trauma', 'PTSD', 'EMDR'],
            certifications: ['EMDR Practitioner', 'Trauma Care Specialist'],
            experienceYears: 12,
            rating: 5.0,
            reviewCount: 89,
            hourlyRateINR: 3000,
            location: 'Delhi',
            bio: 'Specialized in trauma recovery and PTSD treatment with 12+ years of clinical experience.'
        },
        {
            id: 't3',
            name: 'Dr. Priya Sharma',
            photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=10b981&color=fff&size=200',
            specializations: ['Couples Therapy', 'Family Counseling', 'Relationships'],
            certifications: ['Marriage & Family Therapist', 'Gottman Method'],
            experienceYears: 10,
            rating: 4.8,
            reviewCount: 156,
            hourlyRateINR: 2800,
            location: 'Bangalore',
            bio: 'Expert in couples therapy and family systems, helping relationships thrive through evidence-based interventions.'
        },
        {
            id: 't4',
            name: 'Dr. Anil Verma',
            photo: 'https://ui-avatars.com/api/?name=Anil+Verma&background=f59e0b&color=fff&size=200',
            specializations: ['Addiction', 'Substance Abuse', 'Recovery'],
            certifications: ['Addiction Counselor', 'Recovery Specialist'],
            experienceYears: 15,
            rating: 4.7,
            reviewCount: 78,
            hourlyRateINR: 3200,
            location: 'Pune',
            bio: 'Compassionate addiction specialist with extensive experience in substance abuse recovery and relapse prevention.'
        },
        {
            id: 't5',
            name: 'Dr. Neha Patel',
            photo: 'https://ui-avatars.com/api/?name=Neha+Patel&background=ec4899&color=fff&size=200',
            specializations: ['Anxiety', 'Stress Management', 'Mindfulness'],
            certifications: ['Mindfulness-Based Therapist', 'Anxiety Specialist'],
            experienceYears: 6,
            rating: 4.9,
            reviewCount: 124,
            hourlyRateINR: 2200,
            location: 'Hyderabad',
            bio: 'Integrating mindfulness and cognitive techniques to help clients manage anxiety and stress effectively.'
        },
        {
            id: 't6',
            name: 'Dr. Karan Singh',
            photo: 'https://ui-avatars.com/api/?name=Karan+Singh&background=6366f1&color=fff&size=200',
            specializations: ['Depression', 'Bipolar', 'Mood Disorders'],
            certifications: ['Clinical Psychologist', 'Mood Disorder Specialist'],
            experienceYears: 9,
            rating: 4.8,
            reviewCount: 95,
            hourlyRateINR: 2600,
            location: 'Chennai',
            bio: 'Specialized in treating mood disorders with a compassionate, patient-centered therapeutic approach.'
        }
    ];

    // Extract unique specializations for filter
    const allSpecializations = Array.from(
        new Set(therapists.flatMap(t => t.specializations))
    ).sort();

    // Filter therapists
    const filteredTherapists = therapists.filter(therapist => {
        const matchesSpec = selectedSpec === 'all' || therapist.specializations.includes(selectedSpec);
        const matchesSearch = searchQuery === '' ||
            therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            therapist.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSpec && matchesSearch;
    });

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : star - 0.5 <= rating
                                    ? 'fill-yellow-200 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading text-neutral-900 mb-2">Find Your Therapist</h1>
                    <p className="text-neutral-600">Connect with verified mental health professionals</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Specialization Filter */}
                        <div className="md:w-64 relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                            <select
                                value={selectedSpec}
                                onChange={(e) => setSelectedSpec(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Specializations</option>
                                {allSpecializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedSpec !== 'all' || searchQuery) && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm text-neutral-600">Active filters:</span>
                            {selectedSpec !== 'all' && (
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                                    {selectedSpec}
                                    <button onClick={() => setSelectedSpec('all')} className="hover:bg-primary-200 rounded-full">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm flex items-center gap-2">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="hover:bg-secondary-200 rounded-full">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-sm text-neutral-600">
                    Showing <span className="font-semibold text-neutral-900">{filteredTherapists.length}</span> therapist{filteredTherapists.length !== 1 ? 's' : ''}
                </div>

                {/* Therapist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTherapists.map((therapist, index) => (
                        <motion.div
                            key={therapist.id}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Photo & Name */}
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={therapist.photo}
                                    alt={therapist.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-neutral-900">{therapist.name}</h3>
                                    <p className="text-sm text-neutral-600 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {therapist.location}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                {renderStars(therapist.rating)}
                                <span className="text-sm font-semibold text-neutral-900">{therapist.rating}</span>
                                <span className="text-xs text-neutral-500">({therapist.reviewCount} reviews)</span>
                            </div>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {therapist.specializations.slice(0, 3).map((spec, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>

                            {/* Bio Preview */}
                            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                {therapist.bio}
                            </p>

                            {/* Experience & Certifications */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    {therapist.experienceYears}+ years
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4 text-secondary-600" />
                                    {therapist.certifications.length} certs
                                </span>
                            </div>

                            {/* Pricing */}
                            <div className="py-3 px-4 bg-green-50 rounded-lg mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-green-700">₹{therapist.hourlyRateINR}</span>
                                    <span className="text-sm text-green-600">/session</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/therapist-profile/${therapist.id}`)}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                >
                                    View Profile
                                </button>
                                <button
                                    className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                                    title="Send Message"
                                >
                                    <MessageSquare className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredTherapists.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">No therapists found</h3>
                        <p className="text-neutral-600 mb-4">
                            Try adjusting your filters or search query
                        </p>
                        <button
                            onClick={() => {
                                setSelectedSpec('all');
                                setSearchQuery('');
                            }}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
