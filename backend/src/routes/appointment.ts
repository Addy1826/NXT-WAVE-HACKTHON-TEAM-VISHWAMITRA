import express from 'express';
import { authorizeRoles } from '../middleware/auth';
import {
    createAppointment,
    getTherapistAppointments,
    updateAppointmentStatus,
    getPatientAppointments
} from '../controllers/appointmentController';

const router = express.Router();

// Therapist specific
router.get('/therapist', authorizeRoles('THERAPIST'), getTherapistAppointments);
router.patch('/:id/status', authorizeRoles('THERAPIST'), updateAppointmentStatus);

// Patient specific
router.post('/', authorizeRoles('PATIENT'), createAppointment);
router.get('/my-appointments', authorizeRoles('PATIENT'), getPatientAppointments);

export default router;
