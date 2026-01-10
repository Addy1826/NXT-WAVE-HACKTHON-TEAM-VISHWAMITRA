import express from 'express';
import { saveMood, getMoodHistory } from '../controllers/moodController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, saveMood);
router.get('/history/:userId?', authMiddleware, getMoodHistory); // userId is optional, defaults to current user if not provided

export default router;
