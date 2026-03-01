import express from 'express';
import { authorizeRoles } from '../middleware/auth';
import {
    getTherapists,
    requestTherapist,
    getDashboardStats,
    getPatients,
    updateProfile,
    getTherapistProfile
} from '../controllers/therapistController';

const router = express.Router();

router.get('/', getTherapists);
router.post('/request', authorizeRoles('PATIENT'), requestTherapist);

// Dashboard & Management
router.get('/dashboard/stats', authorizeRoles('THERAPIST'), getDashboardStats);
router.get('/my-patients', authorizeRoles('THERAPIST'), getPatients);
router.get('/profile', authorizeRoles('THERAPIST'), getTherapistProfile);
router.post('/profile', authorizeRoles('THERAPIST'), updateProfile);

export default router;
