import express from 'express';
import {
    createAppointment,
    getTherapistAppointments,
    updateAppointmentStatus,
    getPatientAppointments
} from '../controllers/appointmentController';

const router = express.Router();

// Therapist specific
router.get('/therapist', getTherapistAppointments);
router.patch('/:id/status', updateAppointmentStatus);

// Patient specific
router.post('/', createAppointment);
router.get('/my-appointments', getPatientAppointments);

export default router;
