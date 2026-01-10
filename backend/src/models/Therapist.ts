import mongoose, { Schema, Document } from 'mongoose';

export interface ITherapist extends Document {
    user: mongoose.Types.ObjectId;
    specialization: string[];
    bio: string;
    experienceYears: number;
    hourlyRate: number;
    availableSlots: Date[];
    isVerified: boolean;
    ratings: {
        userId: mongoose.Types.ObjectId;
        rating: number;
        comment: string;
    }[];
    averageRating: number;
}

const TherapistSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: [{ type: String }],
    bio: { type: String },
    experienceYears: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
    availableSlots: [{ type: Date }],
    isVerified: { type: Boolean, default: false },
    ratings: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }],
    averageRating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ITherapist>('Therapist', TherapistSchema);
