import { MoodLog } from '../models/Mood';
import { v4 as uuidv4 } from 'uuid';

class MoodService {
    private moods: MoodLog[] = [];

    constructor() {
        // Add some dummy data for testing
        this.moods.push(
            { id: uuidv4(), userId: 'test-user-id', mood: 'Good', timestamp: new Date(Date.now() - 86400000) }, // Yesterday
            { id: uuidv4(), userId: 'test-user-id', mood: 'Okay', timestamp: new Date(Date.now() - 172800000) }  // 2 days ago
        );
    }

    public saveMood(userId: string, mood: string, note?: string): MoodLog {
        const newMood: MoodLog = {
            id: uuidv4(),
            userId,
            mood,
            timestamp: new Date(),
            note
        };
        this.moods.push(newMood);
        return newMood;
    }

    public getMoodHistory(userId: string): MoodLog[] {
        return this.moods
            .filter(m => m.userId === userId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
}

export const moodService = new MoodService();
