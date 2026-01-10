import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Award, MapPin, Video, CheckCircle, Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';

interface FeeStructure {
    individual50: number;
    couples75: number;
    consult30: number;
}

interface Therapist {
    id: string;
    name: string;
    photo: string;
    specializations: string[];
    certifications: string[];
    experienceYears: number;
    rating: number;
    reviewCount: number;
    location: string;
    bio: string;
    feeStructure: FeeStructure;
}

interface TimeSlot {
    id: string;
    label: string;
    dateTime: Date;
}

export const TherapistBookingPage: React.FC = () => {
    const { therapistId } = useParams<{ therapistId: string }>();
    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Mock therapist data (in real app, fetch by ID)
    const therapist: Therapist = {
        id: therapistId || 't1',
        name: 'Dr. Sarah Mehta',
        photo: 'https://ui-avatars.com/api/?name=Sarah+Mehta&background=3b82f6&color=fff&size=200',
        specializations: ['Anxiety', 'Depression', 'CBT', 'Trauma'],
        certifications: [
            'CBT Certified Therapist',
            'Trauma-Informed Care Specialist',
            'Licensed Clinical Psychologist (LCP)',
            'EMDR Practitioner'
        ],
        experienceYears: 8,
        rating: 4.9,
        reviewCount: 142,
        location: 'Mumbai, India',
        bio: 'I am a licensed clinical psychologist with 8+ years of experience specializing in anxiety, depression, and trauma-informed care. My approach combines evidence-based cognitive behavioral therapy (CBT) with compassionate, personalized support tailored to each client\'s unique needs.\n\nI believe in creating a safe, non-judgmental space where healing and growth can flourish. Whether you\'re struggling with overwhelming anxiety, persistent sadness, relationship challenges, or past trauma, I\'m here to walk alongside you on your journey to wellness.\n\nMy therapeutic style is collaborative, warm, and solution-focused. Together, we\'ll identify your goals, develop practical coping strategies, and work toward lasting positive change.',
        feeStructure: {
            individual50: 2500,
            couples75: 3500,
            consult30: 1500
        }
    };

    // Mock available slots (3 slots as requested)
    const availableSlots: TimeSlot[] = [
        {
            id: 'slot1',
            label: 'Today 3:00 PM',
            dateTime: new Date(new Date().setHours(15, 0, 0, 0))
        },
        {
            id: 'slot2',
            label: 'Tomorrow 10:00 AM',
            dateTime: new Date(new Date().getTime() + 86400000).setHours(10, 0, 0, 0) as any
        },
        {
            id: 'slot3',
            label: 'Tomorrow 2:00 PM',
            dateTime: new Date(new Date().getTime() + 86400000).setHours(14, 0, 0, 0) as any
        }
    ];

    const handleBookSession = () => {
        if (!selectedSlot) return;

        // TODO: API call to create appointment
        console.log('Booking session:', { therapistId, slotId: selectedSlot });

        setBookingSuccess(true);

        // Navigate to appointments after 2 seconds
        setTimeout(() => {
            navigate('/appointments');
        }, 2000);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
                <motion.div
                    className="bg-white rounded-2xl p-12 shadow-xl text-center max-w-md"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-heading text-neutral-900 mb-2">Request Sent!</h2>
                    <p className="text-neutral-600 mb-4">
                        Your booking request has been sent to {therapist.name}. You'll receive a confirmation once approved.
                    </p>
                    <p className="text-sm text-neutral-500">
                        Redirecting to your appointments...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Therapists
                </button>

                {/* Header Card */}
                <motion.div
                    className="bg-white rounded-xl p-8 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-start gap-6">
                        <img
                            src={therapist.photo}
                            alt={therapist.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-heading text-neutral-900 mb-2">{therapist.name}</h1>
                            <div className="flex items-center gap-4 mb-3">
                                {renderStars(therapist.rating)}
                                <span className="text-sm font-semibold text-neutral-900">{therapist.rating}</span>
                                <span className="text-sm text-neutral-500">({therapist.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-600">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {therapist.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    {therapist.experienceYears}+ years experience
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Bio & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bio */}
                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-2xl font-heading text-neutral-900 mb-4">About</h2>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                                {therapist.bio}
                            </p>
                        </motion.div>

                        {/* Specializations & Certifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                className="bg-white rounded-xl p-8 shadow-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className="text-xl font-heading text-neutral-900 mb-4">Specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                    {therapist.specializations.map((spec, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                        >
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white rounded-xl p-8 shadow-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="text-xl font-heading text-neutral-900 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-secondary-600" />
                                    Certifications
                                </h3>
                                <ul className="space-y-2">
                                    {therapist.certifications.map((cert, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{cert}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="bg-white rounded-xl p-6 shadow-sm sticky top-6 space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Fee Structure */}
                            <div>
                                <h3 className="text-xl font-heading text-neutral-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    Fees
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Individual (50 min)</p>
                                        </div>
                                        <span className="text-lg font-bold text-green-700">₹{therapist.feeStructure.individual50}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Couples (75 min)</p>
                                        </div>
                                        <span className="text-lg font-bold text-green-700">₹{therapist.feeStructure.couples75}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Consultation (30 min)</p>
                                        </div>
                                        <span className="text-lg font-bold text-green-700">₹{therapist.feeStructure.consult30}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Available Slots */}
                            <div>
                                <h3 className="text-lg font-heading text-neutral-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                    Available Slots
                                </h3>
                                <div className="space-y-2">
                                    {availableSlots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            className={`w-full p-3 rounded-lg border-2 transition-all ${selectedSlot === slot.id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-neutral-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-neutral-600" />
                                                <span className="font-medium text-neutral-900">{slot.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={handleBookSession}
                                disabled={!selectedSlot}
                                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${selectedSlot
                                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                                        : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                    }`}
                            >
                                <Video className="w-5 h-5" />
                                Book Session
                            </button>

                            <p className="text-xs text-neutral-500 text-center">
                                Your booking will be sent for approval. Payment is due after confirmation.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
