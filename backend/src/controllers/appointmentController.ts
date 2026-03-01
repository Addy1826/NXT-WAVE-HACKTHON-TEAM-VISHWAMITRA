import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Therapist from '../models/Therapist';
import Payment from '../models/Payment';
import User from '../models/User';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const { therapistId, date, time, type, notes, amount } = req.body;

        const scheduledAt = new Date(`${date}T${time}:00`);

        const appointment = await Appointment.create({
            patientId,
            therapistId,
            scheduledAt,
            type: type || 'VIDEO_CALL',
            status: 'SCHEDULED',
            durationMinutes: 60,
        });

        if (amount) {
            await Payment.create({
                userId: patientId,
                appointmentId: appointment._id,
                amountUSD: amount,
                status: 'PENDING'
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
        const therapist = await Therapist.findOne({ userId });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        const appointments = await Appointment.find({ therapistId: therapist._id })
            .populate('patientId', 'name email avatar')
            .sort({ scheduledAt: 1 })
            .lean();

        // Map `patientId` back to `patient` for frontend compatibility
        const formattedAppointments = appointments.map(apt => ({
            ...apt,
            patient: apt.patientId
        }));

        res.json(formattedAppointments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;
        const userId = (req as any).user?.id;

        const therapist = await Therapist.findOne({ userId });
        if (!therapist) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const existingAppt = await Appointment.findOne({
            _id: id,
            therapistId: therapist._id
        });

        if (!existingAppt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status, videoRoomId: meetingLink },
            { new: true }
        );

        res.json(updatedAppointment);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

export const getPatientAppointments = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const appointments = await Appointment.find({ patientId })
            .populate({
                path: 'therapistId',
                populate: {
                    path: 'userId',
                    select: 'name avatar'
                }
            })
            .sort({ scheduledAt: -1 })
            .lean();

        // Format to match expected frontend output
        const formattedAppointments = appointments.map(apt => {
            const therapistDoc: any = apt.therapistId;
            return {
                ...apt,
                therapist: {
                    ...therapistDoc,
                    user: therapistDoc?.userId
                }
            };
        });

        res.json(formattedAppointments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
}
