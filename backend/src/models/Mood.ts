export interface MoodLog {
    id: string;
    userId: string;
    mood: string; // 'Great', 'Good', 'Okay', 'Low', 'Bad'
    timestamp: Date;
    note?: string;
}
