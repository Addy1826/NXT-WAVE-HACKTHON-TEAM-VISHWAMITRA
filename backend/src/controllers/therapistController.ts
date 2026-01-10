import { Request, Response } from 'express';
import { TherapistMatchingService } from '../services/therapistMatchingService';
import { logger } from '../utils/logger';

const therapistService = new TherapistMatchingService();

export const getTherapists = async (req: Request, res: Response) => {
    try {
        const therapists = await therapistService.getAllTherapists();
        res.json(therapists);
    } catch (error) {
        logger.error('Error fetching therapists:', error);
        res.status(500).json({ error: 'Failed to fetch therapists' });
    }
};

export const requestTherapist = async (req: Request, res: Response) => {
    try {
        const { preferences } = req.body;
        const userId = (req as any).user.id;
        const assignment = await therapistService.requestTherapist(userId, preferences);
        res.json(assignment);
    } catch (error) {
        logger.error('Error requesting therapist:', error);
        res.status(500).json({ error: 'Failed to request therapist' });
    }
};
