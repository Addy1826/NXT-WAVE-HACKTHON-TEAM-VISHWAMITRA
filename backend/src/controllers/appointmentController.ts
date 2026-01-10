import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Therapist from '../models/Therapist';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const { therapistId, date, time, type, notes, amount } = req.body;

        const appointment = new Appointment({
            patientId,
            therapistId, // Expecting ID of the Therapist document (not User)
            date,
            time,
            type,
            notes,
            amount,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};

export const getTherapistAppointments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        // Find therapist profile associated with this user
        const therapist = await Therapist.findOne({ user: userId });

        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }

        const appointments = await Appointment.find({ therapistId: therapist._id })
            .populate('patientId', 'name email avatar')
            .sort({ date: 1, time: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;
        const userId = (req as any).user?.id;

        // Verify the therapist owns this appointment
        const therapist = await Therapist.findOne({ user: userId });
        if (!therapist) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const appointment = await Appointment.findOne({ _id: id, therapistId: therapist._id });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        if (meetingLink) appointment.meetingLink = meetingLink;

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
};

export const getPatientAppointments = async (req: Request, res: Response) => {
    try {
        const patientId = (req as any).user?.id;
        const appointments = await Appointment.find({ patientId })
            .populate({
                path: 'therapistId',
                populate: { path: 'user', select: 'name avatar' }
            })
            .sort({ date: -1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
}
