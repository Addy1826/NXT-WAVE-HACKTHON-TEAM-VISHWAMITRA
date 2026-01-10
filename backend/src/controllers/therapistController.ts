import { Request, Response } from 'express';
import { TherapistMatchingService } from '../services/therapistMatchingService';
import { logger } from '../utils/logger';
import Therapist from '../models/Therapist';
import Appointment from '../models/Appointment';
import User from '../models/User';

const therapistService = new TherapistMatchingService();

export const getTherapists = async (req: Request, res: Response) => {
    try {
        const therapists = await therapistService.getAllTherapists();
        res.json(therapists);
    } catch (error) {
        logger.error('Error fetching therapists:', error);
        res.status(500).json({ error: 'Failed to fetch therapists' });
    }
};

export const requestTherapist = async (req: Request, res: Response) => {
    try {
        const { preferences } = req.body;
        const userId = (req as any).user.id;
        const assignment = await therapistService.requestTherapist(userId, preferences);
        res.json(assignment);
    } catch (error) {
        logger.error('Error requesting therapist:', error);
        res.status(500).json({ error: 'Failed to request therapist' });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const therapist = await Therapist.findOne({ user: userId });
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        const totalAppointments = await Appointment.countDocuments({ therapistId: therapist._id });
        const completedAppointments = await Appointment.countDocuments({
            therapistId: therapist._id,
            status: 'completed'
        });

        // Calculate earnings
        const appointments = await Appointment.find({
            therapistId: therapist._id,
            paymentStatus: 'paid'
        });
        const totalEarnings = appointments.reduce((sum, appt) => sum + (appt.amount || 0), 0);

        const uniquePatients = await Appointment.distinct('patientId', { therapistId: therapist._id });

        const pendingAppointments = await Appointment.countDocuments({
            therapistId: therapist._id,
            status: 'pending'
        });

        res.json({
            metrics: {
                totalPatients: uniquePatients.length,
                appointments: totalAppointments,
                completedSessions: completedAppointments,
                pendingRequests: pendingAppointments,
                totalEarnings,
                rating: therapist.averageRating
            }
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const therapist = await Therapist.findOne({ user: userId });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }

        const appointments = await Appointment.find({ therapistId: therapist._id })
            .populate('patientId', 'name email avatar')
            .sort({ date: -1 });

        const patientMap = new Map();

        appointments.forEach((appt: any) => {
            if (appt.patientId && !patientMap.has(appt.patientId._id.toString())) {
                patientMap.set(appt.patientId._id.toString(), {
                    _id: appt.patientId._id,
                    name: appt.patientId.name,
                    email: appt.patientId.email,
                    avatar: appt.patientId.avatar,
                    lastSession: appt.date,
                    totalSessions: 1
                });
            } else if (appt.patientId) {
                const patient = patientMap.get(appt.patientId._id.toString());
                patient.totalSessions += 1;
            }
        });

        res.json(Array.from(patientMap.values()));
    } catch (error) {
        logger.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { bio, specialization, hourlyRate, experienceYears } = req.body;

        const therapist = await Therapist.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    bio,
                    specialization,
                    hourlyRate,
                    experienceYears
                }
            },
            { new: true, upsert: true }
        );

        res.json(therapist);
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTherapistProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const therapist = await Therapist.findOne({ user: userId }).populate('user', 'name email avatar');

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        res.json(therapist);
    } catch (error) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
