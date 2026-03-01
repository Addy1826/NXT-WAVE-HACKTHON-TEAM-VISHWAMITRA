import express from 'express';
import { saveMood, getMoodHistory } from '../controllers/moodController';
import { authMiddleware, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('PATIENT'), saveMood);
router.get('/history/:userId?', authMiddleware, authorizeRoles('PATIENT'), getMoodHistory); // userId is optional, defaults to current user if not provided

export default router;
