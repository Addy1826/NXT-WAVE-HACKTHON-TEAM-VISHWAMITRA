// Crisis detection constants
export const CRISIS_LEVELS = {
  LEVEL_1: { score: 1, category: 'LOW', description: 'Mild distress, self-help resources' },
  LEVEL_2: { score: 2, category: 'LOW', description: 'Moderate distress, peer support' },
  LEVEL_3: { score: 3, category: 'LOW', description: 'Noticeable distress, guided resources' },
  LEVEL_4: { score: 4, category: 'MODERATE', description: 'Concerning distress, counselor needed' },
  LEVEL_5: { score: 5, category: 'MODERATE', description: 'Significant distress, professional help' },
  LEVEL_6: { score: 6, category: 'MODERATE', description: 'High distress, qualified therapist' },
  LEVEL_7: { score: 7, category: 'HIGH', description: 'Severe distress, immediate intervention' },
  LEVEL_8: { score: 8, category: 'HIGH', description: 'Crisis state, urgent professional help' },
  LEVEL_9: { score: 9, category: 'CRITICAL', description: 'Acute crisis, emergency services' },
  LEVEL_10: { score: 10, category: 'CRITICAL', description: 'Imminent danger, immediate emergency response' },
} as const;

export type CrisisLevelKey = keyof typeof CRISIS_LEVELS;
export type CrisisCategory = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

// Crisis keywords and triggers
export const CRISIS_KEYWORDS = {
  SUICIDE: [
    'suicide', 'kill myself', 'end it all', 'better off dead', 'want to die',
    'take my own life', 'end my life', 'no point living', 'suicidal thoughts'
  ],
  SELF_HARM: [
    'cut myself', 'hurt myself', 'self harm', 'self-harm', 'cutting',
    'burning myself', 'self injury', 'self-injury'
  ],
  VIOLENCE: [
    'hurt someone', 'kill someone', 'violent thoughts', 'harm others',
    'murder', 'attack', 'violent urges'
  ],
  SUBSTANCE_ABUSE: [
    'overdose', 'too many pills', 'drink myself to death', 'substance abuse',
    'drug abuse', 'addiction crisis'
  ],
  EMERGENCY: [
    'emergency', 'urgent', 'help me now', 'crisis', 'immediate help',
    'right now', '911', 'emergency room'
  ]
} as const;

// Language support
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', code: 'en' },
  es: { name: 'Spanish', nativeName: 'Español', code: 'es' },
  fr: { name: 'French', nativeName: 'Français', code: 'fr' },
  de: { name: 'German', nativeName: 'Deutsch', code: 'de' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
  ar: { name: 'Arabic', nativeName: 'العربية', code: 'ar' },
} as const;

export type SupportedLanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Response time requirements (in seconds)
export const RESPONSE_TIME_LIMITS = {
  ML_PROCESSING: 0.2, // 200ms for ML inference
  CRISIS_DETECTION: 0.5, // 500ms for crisis analysis
  BOT_RESPONSE: 2, // 2 seconds for bot response
  THERAPIST_NOTIFICATION: 30, // 30 seconds for therapist notification
  EMERGENCY_ESCALATION: 60, // 1 minute for emergency escalation
} as const;

// API rate limits
export const RATE_LIMITS = {
  MESSAGES_PER_MINUTE: 30,
  MESSAGES_PER_HOUR: 500,
  CRISIS_DETECTIONS_PER_HOUR: 100,
  VIDEO_CALLS_PER_DAY: 5,
} as const;

// Session configuration
export const SESSION_CONFIG = {
  MAX_DURATION_HOURS: 2,
  WARNING_TIME_MINUTES: 10, // Warn before session ends
  IDLE_TIMEOUT_MINUTES: 30,
  MAX_CONCURRENT_SESSIONS: 3,
} as const;

// HIPAA compliance constants
export const HIPAA_CONFIG = {
  DATA_RETENTION_YEARS: 7,
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  LOG_RETENTION_MONTHS: 6,
  AUDIT_TRAIL_YEARS: 6,
  SESSION_TIMEOUT_HOURS: 1,
} as const;

// Professional network
export const PROFESSIONAL_ROLES = {
  CRISIS_COUNSELOR: { priority: 1, responseTimeMinutes: 2 },
  LICENSED_THERAPIST: { priority: 2, responseTimeMinutes: 5 },
  PSYCHIATRIST: { priority: 3, responseTimeMinutes: 10 },
  PEER_COUNSELOR: { priority: 4, responseTimeMinutes: 15 },
} as const;

// Emergency contacts
export const EMERGENCY_CONTACTS = {
  US: {
    SUICIDE_PREVENTION: '988',
    CRISIS_TEXT_LINE: 'Text HOME to 741741',
    EMERGENCY_SERVICES: '911',
  },
  INTERNATIONAL: {
    SUICIDE_PREVENTION: '+1-800-273-8255',
    CRISIS_TEXT_LINE: 'Text HOME to 741741',
  },
} as const;

// ML Model configurations
export const ML_MODELS = {
  SENTIMENT_ANALYSIS: {
    PRIMARY: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    BACKUP: 'nlptown/bert-base-multilingual-uncased-sentiment',
  },
  MENTAL_HEALTH: {
    PRIMARY: 'mental/mental-bert-base-uncased',
    BACKUP: 'distilbert-base-uncased',
  },
  LANGUAGE_DETECTION: {
    PRIMARY: 'facebook/fasttext-language-identification',
    BACKUP: 'google/language-detection',
  },
} as const;

// WebSocket events
export const WS_EVENTS = {
  // Client to server
  MESSAGE_SEND: 'message:send',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  VOICE_START: 'voice:start',
  VOICE_END: 'voice:end',
  
  // Server to client
  MESSAGE_RECEIVE: 'message:receive',
  CRISIS_ALERT: 'crisis:alert',
  THERAPIST_ASSIGNED: 'therapist:assigned',
  SESSION_START: 'session:start',
  SESSION_END: 'session:end',
  SYSTEM_NOTIFICATION: 'system:notification',
  
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',
} as const;

export type WSEvent = keyof typeof WS_EVENTS;