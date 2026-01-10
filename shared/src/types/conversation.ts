import { z } from 'zod';

// Crisis detection types
export const CrisisLevel = z.enum([
  'level_1', 'level_2', 'level_3',  // LOW: Peer support, self-help
  'level_4', 'level_5', 'level_6',  // MODERATE: Qualified counselor
  'level_7', 'level_8',             // HIGH: Immediate professional intervention
  'level_9', 'level_10'             // CRITICAL: Emergency services
]);
export type CrisisLevel = z.infer<typeof CrisisLevel>;

export const SentimentScore = z.object({
  positive: z.number().min(0).max(1),
  negative: z.number().min(0).max(1),
  neutral: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
});
export type SentimentScore = z.infer<typeof SentimentScore>;

export const CrisisDetectionResult = z.object({
  level: CrisisLevel,
  score: z.number().min(1).max(10),
  confidence: z.number().min(0).max(1),
  triggers: z.array(z.string()),
  reasoning: z.string(),
  recommendedActions: z.array(z.string()),
  urgency: z.enum(['low', 'moderate', 'high', 'critical']),
  sentimentAnalysis: SentimentScore,
  detectedLanguage: z.string(),
  timestamp: z.date(),
  modelVersion: z.string(),
});
export type CrisisDetectionResult = z.infer<typeof CrisisDetectionResult>;

// Message types
export const MessageType = z.enum([
  'user_message',
  'bot_response', 
  'system_alert',
  'crisis_escalation',
  'therapist_message',
  'voice_message',
  'image_message',
  'file_attachment'
]);
export type MessageType = z.infer<typeof MessageType>;

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  type: MessageType,
  content: z.string(),
  metadata: z.object({
    language: z.string().optional(),
    sentimentScore: SentimentScore.optional(),
    crisisDetection: CrisisDetectionResult.optional(),
    attachments: z.array(z.object({
      type: z.enum(['image', 'audio', 'document']),
      url: z.string(),
      filename: z.string(),
      size: z.number(),
    })).optional(),
    voiceData: z.object({
      duration: z.number(),
      transcription: z.string(),
      confidence: z.number(),
    }).optional(),
  }),
  isEncrypted: z.boolean().default(true),
  timestamp: z.date(),
  editedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

// Conversation types
export const ConversationStatus = z.enum([
  'active',
  'escalated', 
  'resolved',
  'emergency',
  'archived'
]);
export type ConversationStatus = z.infer<typeof ConversationStatus>;

export const ConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  therapistId: z.string().optional(),
  status: ConversationStatus,
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  tags: z.array(z.string()),
  summary: z.string().optional(),
  currentCrisisLevel: CrisisLevel.optional(),
  escalationHistory: z.array(z.object({
    fromLevel: CrisisLevel,
    toLevel: CrisisLevel,
    timestamp: z.date(),
    reason: z.string(),
    handledBy: z.string(),
  })),
  startedAt: z.date(),
  lastMessageAt: z.date(),
  closedAt: z.date().optional(),
  encryptionKeyId: z.string(),
});
export type Conversation = z.infer<typeof ConversationSchema>;