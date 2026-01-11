import { Request, Response } from 'express';
import { TherapistMatchingService } from '../services/therapistMatchingService';
import { logger } from '../utils/logger';
import prisma from '../config/prisma';

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

        const therapist = await prisma.therapist.findUnique({
            where: { userId: userId }
        });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        const totalAppointments = await prisma.appointment.count({
            where: { therapistId: therapist.id }
        });

        const completedAppointments = await prisma.appointment.count({
            where: {
                therapistId: therapist.id,
                status: 'COMPLETED'
            }
        });

        const pendingAppointments = await prisma.appointment.count({
            where: {
                therapistId: therapist.id,
                status: 'SCHEDULED' // Treating SCHEDULED as pending if not confirmed, or maybe PENDING? Schema says SCHEDULED is default.
                // Adapting to schema: PENDING is not in AppointmentStatus enum? 
                // Schema has: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED... 
                // Mongoose code had 'pending'. Assuming 'SCHEDULED' equivalent.
            }
        });

        // Calculate earnings (Mock logic in Mongoose was assuming db field 'amount', schema has 'amountUSD')
        // Using amountUSD for now.
        const earningsAggregate = await prisma.payment.aggregate({
            where: {
                // Payments linked to therapist's appointments? Schema is Payment -> Appointment -> Therapist
                appointment: {
                    therapistId: therapist.id
                },
                status: 'COMPLETED'
            },
            _sum: {
                amountUSD: true
            }
        });
        const totalEarnings = earningsAggregate._sum.amountUSD || 0;


        // Unique patients
        const distinctPatients = await prisma.appointment.findMany({
            where: { therapistId: therapist.id },
            select: { patientId: true },
            distinct: ['patientId']
        });

        res.json({
            metrics: {
                totalPatients: distinctPatients.length,
                appointments: totalAppointments,
                completedSessions: completedAppointments,
                pendingRequests: pendingAppointments,
                totalEarnings,
                rating: therapist.averageRating || 0
            }
        });
    } catch (error: any) {
        logger.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const therapist = await prisma.therapist.findUnique({ where: { userId } });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }

        const appointments = await prisma.appointment.findMany({
            where: { therapistId: therapist.id },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: { scheduledAt: 'desc' }
        });

        const patientMap = new Map();

        appointments.forEach((appt: any) => {
            if (appt.patient && !patientMap.has(appt.patient.id)) {
                patientMap.set(appt.patient.id, {
                    _id: appt.patient.id,
                    name: appt.patient.name,
                    email: appt.patient.email,
                    avatar: appt.patient.avatar,
                    lastSession: appt.scheduledAt,
                    totalSessions: 1
                });
            } else if (appt.patient) {
                const patient = patientMap.get(appt.patient.id);
                patient.totalSessions += 1;
            }
        });

        res.json(Array.from(patientMap.values()));
    } catch (error: any) {
        logger.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { bio, specialization, hourlyRate, experienceYears } = req.body;

        const therapist = await prisma.therapist.update({
            where: { userId: userId },
            data: {
                bio,
                specializations: specialization, // Schema name mismatch: 'specializations' vs 'specialization'
                hourlyRateUSD: hourlyRate ? parseFloat(hourlyRate) : undefined,
                experienceYears: experienceYears ? parseInt(experienceYears) : undefined
            }
        });

        res.json(therapist);
    } catch (error: any) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTherapistProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const therapist = await prisma.therapist.findUnique({
            where: { userId },
            include: { user: { select: { name: true, email: true, avatar: true } } }
        });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        res.json(therapist);
    } catch (error: any) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
