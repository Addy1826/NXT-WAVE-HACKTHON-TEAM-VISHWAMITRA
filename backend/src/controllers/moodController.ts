import { Request, Response } from 'express';
import { moodService } from '../services/moodService';

export const saveMood = (req: Request, res: Response) => {
    try {
        const { mood, note } = req.body;
        const userId = (req as any).user.userId; // Extracted from auth middleware

        if (!mood) {
            return res.status(400).json({ message: 'Mood is required' });
        }

        const savedMood = moodService.saveMood(userId, mood, note);
        res.status(201).json(savedMood);
    } catch (error) {
        res.status(500).json({ message: 'Error saving mood', error });
    }
};

export const getMoodHistory = (req: Request, res: Response) => {
    try {
        const userId = req.params.userId || (req as any).user.userId;
        // Allow therapists to view other users' mood, or users to view their own
        // For now, we'll assume if a userId param is provided, it's a therapist viewing a patient

        const history = moodService.getMoodHistory(userId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mood history', error });
    }
};
