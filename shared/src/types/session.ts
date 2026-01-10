import { z } from 'zod';

// Professional session types
export const SessionType = z.enum([
  'crisis_intervention',
  'emergency_consultation',
  'scheduled_therapy',
  'peer_support',
  'group_session'
]);
export type SessionType = z.infer<typeof SessionType>;

export const SessionStatus = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
  'emergency_ended'
]);
export type SessionStatus = z.infer<typeof SessionStatus>;

export const SessionSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  therapistId: z.string(),
  type: SessionType,
  status: SessionStatus,
  scheduledAt: z.date(),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
  duration: z.number().optional(), // in minutes
  notes: z.string().optional(),
  crisisLevelAtStart: z.string().optional(),
  crisisLevelAtEnd: z.string().optional(),
  interventions: z.array(z.string()),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.date().optional(),
  videoCallData: z.object({
    roomId: z.string(),
    recordingId: z.string().optional(),
    quality: z.enum(['audio_only', 'standard', 'hd']),
    participants: z.array(z.string()),
  }).optional(),
  billing: z.object({
    rate: z.number(),
    currency: z.string(),
    insuranceClaim: z.string().optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  }).optional(),
});
export type Session = z.infer<typeof SessionSchema>;

// Crisis escalation types
export const EscalationType = z.enum([
  'automatic_detection',
  'manual_override',
  'user_request',
  'therapist_escalation',
  'emergency_contact'
]);
export type EscalationType = z.infer<typeof EscalationType>;

export const EscalationSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  type: EscalationType,
  fromLevel: z.string(),
  toLevel: z.string(),
  trigger: z.string(),
  automaticActions: z.array(z.object({
    action: z.string(),
    status: z.enum(['pending', 'completed', 'failed']),
    timestamp: z.date(),
    details: z.string().optional(),
  })),
  assignedResponders: z.array(z.object({
    id: z.string(),
    role: z.enum(['therapist', 'crisis_counselor', 'emergency_services']),
    responseTime: z.number().optional(),
    status: z.enum(['notified', 'acknowledged', 'responding', 'completed']),
  })),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
    contacted: z.boolean(),
    contactedAt: z.date().optional(),
  })),
  resolution: z.object({
    outcome: z.enum(['resolved', 'transferred', 'ongoing', 'emergency_services']),
    notes: z.string(),
    followUpRequired: z.boolean(),
    closedBy: z.string(),
    closedAt: z.date(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Escalation = z.infer<typeof EscalationSchema>;