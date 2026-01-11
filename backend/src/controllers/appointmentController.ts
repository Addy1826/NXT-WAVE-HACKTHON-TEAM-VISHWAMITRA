import { Request, Response } from 'express';
import prisma from '../config/prisma';
// import Appointment from '../models/Appointment';
// import Therapist from '../models/Therapist';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const { therapistId, date, time, type, notes, amount } = req.body;

        // Prisma create
        // Combine date and time to Date object if needed, or store as strings if schema allows.
        // Schema: scheduledAt DateTime
        // Mongoose was storing date and time separately?
        // Schema has 'scheduledAt'. Backend logic must adapt.
        const scheduledAt = new Date(`${date}T${time}:00`);

        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                therapistId,
                scheduledAt,
                type: type || 'VIDEO_CALL', // Enum matching
                status: 'SCHEDULED', // Default
                durationMinutes: 60,
                // notes stored where? Schema has 'sessionNotesId' or Mongoose fallback.
                // Ignoring notes for now or assume they go to sessionNotesId logic later.
            }
        });

        // Create pending payment if amount > 0
        if (amount) {
            await prisma.payment.create({
                data: {
                    userId: patientId,
                    appointmentId: appointment.id,
                    amountUSD: amount,
                    status: 'PENDING'
                }
            });
        }

        res.status(201).json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
};

export const getTherapistAppointments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        // Find therapist profile associated with this user
        const therapist = await prisma.therapist.findUnique({ where: { userId } });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        const appointments = await prisma.appointment.findMany({
            where: { therapistId: therapist.id },
            include: {
                patient: { select: { name: true, email: true, avatar: true } }
            },
            orderBy: { scheduledAt: 'asc' }
        });

        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;
        const userId = (req as any).user?.id;

        // Verify the therapist owns this appointment
        const therapist = await prisma.therapist.findUnique({ where: { userId } });
        if (!therapist) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check ownership
        const existingAppt = await prisma.appointment.findFirst({
            where: { id, therapistId: therapist.id }
        });

        if (!existingAppt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                status: status, // Ensure status string matches enum or use map
                // meetingLink? Schema doesn't have meetingLink on Appointment? 
                // Schema has videoRoomId. Using that for link/id.
                videoRoomId: meetingLink
            }
        });

        res.json(updatedAppointment);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

export const getPatientAppointments = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const appointments = await prisma.appointment.findMany({
            where: { patientId },
            include: {
                therapist: {
                    include: { user: { select: { name: true, avatar: true } } }
                }
            },
            orderBy: { scheduledAt: 'desc' }
        });

        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
}
