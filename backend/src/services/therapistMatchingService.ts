import mongoose from 'mongoose';

export class TherapistMatchingService {
    async requestTherapist(userId: string, preferences: any): Promise<any> {
        // Return dummy data if DB is not connected or just for demo
        return {
            therapistId: 'mock_therapist_1',
            name: 'Dr. Sarah Wilson',
            specialization: 'Anxiety & Depression',
            rating: 4.9,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            availability: 'Available Now'
        };
    }

    async assignEmergencyTherapist(userId: string, crisisLevel: number): Promise<any> {
        return {
            therapistId: 'mock_emergency_1',
            name: 'Dr. Robert Chen',
            specialization: 'Crisis Intervention',
            rating: 5.0,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
            priority: 'IMMEDIATE'
        };
    }

    async getAllTherapists(): Promise<any[]> {
        return [
            {
                _id: '1',
                name: 'Dr. Sarah Wilson',
                specialization: 'Anxiety & Depression',
                experience: '10 years',
                rating: 4.9,
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                hourlyRate: 120,
                available: true,
                bio: 'Dr. Sarah Wilson is a licensed clinical psychologist with over a decade of experience in treating anxiety and depression. She uses a combination of CBT and mindfulness techniques to help her clients achieve mental wellness.',
                education: 'Ph.D. in Clinical Psychology, Stanford University',
                reviews: [
                    { id: 1, user: 'Anonymous', rating: 5, comment: 'Dr. Wilson changed my life. Highly recommended.' },
                    { id: 2, user: 'John D.', rating: 5, comment: 'Very understanding and patient.' }
                ]
            },
            {
                _id: '2',
                name: 'Dr. Michael Brown',
                specialization: 'Couples Therapy',
                experience: '15 years',
                rating: 4.8,
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
                hourlyRate: 150,
                available: false,
                bio: 'Dr. Michael Brown specializes in helping couples navigate relationship challenges. He believes in open communication and building strong foundations for lasting partnerships.',
                education: 'Psy.D. in Marriage and Family Therapy, UCLA',
                reviews: [
                    { id: 1, user: 'Alice & Bob', rating: 5, comment: 'We were on the brink of divorce, but Dr. Brown helped us find our way back.' }
                ]
            },
            {
                _id: '3',
                name: 'Dr. Emily Davis',
                specialization: 'Career Counseling',
                experience: '8 years',
                rating: 4.7,
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
                hourlyRate: 100,
                available: true,
                bio: 'Dr. Emily Davis helps individuals find fulfillment in their careers. Whether you are looking for a career change or want to climb the corporate ladder, she can guide you.',
                education: 'M.A. in Counseling Psychology, NYU',
                reviews: []
            },
            {
                _id: '4',
                name: 'Dr. James Miller',
                specialization: 'Trauma & PTSD',
                experience: '12 years',
                rating: 4.9,
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
                hourlyRate: 140,
                available: true,
                bio: 'Dr. James Miller is an expert in trauma recovery. He provides a safe and supportive environment for healing.',
                education: 'Ph.D. in Psychology, Harvard University',
                reviews: [
                    { id: 1, user: 'Sarah K.', rating: 5, comment: 'I finally feel safe again.' }
                ]
            }
        ];
    }
}
