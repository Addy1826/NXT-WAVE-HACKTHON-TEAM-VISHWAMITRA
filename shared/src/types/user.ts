import { z } from 'zod';

// User types
export const UserRole = z.enum(['user', 'therapist', 'admin', 'crisis_responder']);
export type UserRole = z.infer<typeof UserRole>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  role: UserRole,
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number().min(13).max(120),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    preferredLanguage: z.string().default('en'),
    timezone: z.string().default('UTC'),
    emergencyContact: z.object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string(),
    }).optional(),
  }),
  preferences: z.object({
    enableCrisisDetection: z.boolean().default(true),
    enableVoiceInput: z.boolean().default(false),
    enableNotifications: z.boolean().default(true),
    dataRetentionConsent: z.boolean(),
    researchParticipationConsent: z.boolean().default(false),
  }),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastActiveAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Therapist-specific types
export const TherapistSchema = UserSchema.extend({
  role: z.literal('therapist'),
  credentials: z.object({
    licenseNumber: z.string(),
    licenseState: z.string(),
    licenseExpiry: z.date(),
    specializations: z.array(z.string()),
    yearsOfExperience: z.number().min(0),
    education: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.number(),
    })),
    certifications: z.array(z.string()),
  }),
  availability: z.object({
    timezone: z.string(),
    schedule: z.array(z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    })),
    isOnCall: z.boolean().default(false),
    maxConcurrentSessions: z.number().default(3),
  }),
  pricing: z.object({
    hourlyRate: z.number().min(0),
    currency: z.string().default('USD'),
    acceptsInsurance: z.boolean(),
    insuranceProviders: z.array(z.string()),
  }),
  stats: z.object({
    totalSessions: z.number().default(0),
    averageRating: z.number().min(0).max(5).default(0),
    responseTime: z.number().default(0), // in minutes
    crisisResponseTime: z.number().default(0), // in minutes
  }),
});

export type Therapist = z.infer<typeof TherapistSchema>;