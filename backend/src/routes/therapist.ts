import express from 'express';
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
router.post('/request', requestTherapist);

// Dashboard & Management
router.get('/dashboard/stats', getDashboardStats);
router.get('/my-patients', getPatients);
router.get('/profile', getTherapistProfile);
router.post('/profile', updateProfile);

export default router;
