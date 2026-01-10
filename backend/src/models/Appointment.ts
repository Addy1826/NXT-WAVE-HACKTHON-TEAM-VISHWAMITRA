import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    therapistId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    date: Date;
    time: string; // HH:mm
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    type: 'video' | 'chat' | 'in-person';
    meetingLink?: string;
    notes?: string;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
    therapistId: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['video', 'chat', 'in-person'],
        default: 'video'
    },
    meetingLink: { type: String },
    notes: { type: String },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
