"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientAppointments = exports.updateAppointmentStatus = exports.getTherapistAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const Therapist_1 = __importDefault(require("../models/Therapist"));
const Payment_1 = __importDefault(require("../models/Payment"));
const createAppointment = async (req, res) => {
    try {
        const patientId = req.user?.id;
        const { therapistId, date, time, type, notes, amount } = req.body;
        const scheduledAt = new Date(`${date}T${time}:00`);
        const appointment = await Appointment_1.default.create({
            patientId,
            therapistId,
            scheduledAt,
            type: type || 'VIDEO_CALL',
            status: 'SCHEDULED',
            durationMinutes: 60,
        });
        if (amount) {
            await Payment_1.default.create({
                userId: patientId,
                appointmentId: appointment._id,
                amountUSD: amount,
                status: 'PENDING'
            });
        }
        res.status(201).json(appointment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
};
exports.createAppointment = createAppointment;
const getTherapistAppointments = async (req, res) => {
    try {
        const userId = req.user?.id;
        const therapist = await Therapist_1.default.findOne({ userId });
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist profile not found' });
        }
        const appointments = await Appointment_1.default.find({ therapistId: therapist._id })
            .populate('patientId', 'name email avatar')
            .sort({ scheduledAt: 1 })
            .lean();
        // Map `patientId` back to `patient` for frontend compatibility
        const formattedAppointments = appointments.map(apt => ({
            ...apt,
            patient: apt.patientId
        }));
        res.json(formattedAppointments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};
exports.getTherapistAppointments = getTherapistAppointments;
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;
        const userId = req.user?.id;
        const therapist = await Therapist_1.default.findOne({ userId });
        if (!therapist) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const existingAppt = await Appointment_1.default.findOne({
            _id: id,
            therapistId: therapist._id
        });
        if (!existingAppt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        const updatedAppointment = await Appointment_1.default.findByIdAndUpdate(id, { status, videoRoomId: meetingLink }, { new: true });
        res.json(updatedAppointment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user?.id;
        const appointments = await Appointment_1.default.find({ patientId })
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
            const therapistDoc = apt.therapistId;
            return {
                ...apt,
                therapist: {
                    ...therapistDoc,
                    user: therapistDoc?.userId
                }
            };
        });
        res.json(formattedAppointments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};
exports.getPatientAppointments = getPatientAppointments;
//# sourceMappingURL=appointmentController.js.map