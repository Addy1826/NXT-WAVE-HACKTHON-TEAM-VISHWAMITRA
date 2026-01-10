export interface Appointment {
    id: string;
    therapistId: string;
    patientId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: 'pending' | 'confirmed' | 'cancelled';
    meetingLink?: string;
    type: 'video' | 'chat' | 'in-person';
}
