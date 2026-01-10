import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Utility functions for crisis detection and management
 */

export class CrisisUtils {
  /**
   * Calculate crisis level based on multiple factors
   */
  static calculateCrisisLevel(
    sentimentScore: number,
    keywordMatches: string[],
    contextualFactors: {
      historyScore?: number;
      timeOfDay?: number; // 0-23
      consecutiveNegativeMessages?: number;
      responseTime?: number;
    } = {}
  ): number {
    let baseScore = Math.abs(sentimentScore) * 5; // Convert sentiment to 0-5 range
    
    // Keyword severity multiplier
    const keywordSeverity = keywordMatches.length * 1.5;
    
    // Historical context (if user has previous crisis episodes)
    const historyMultiplier = contextualFactors.historyScore ? 
      Math.min(contextualFactors.historyScore * 0.3, 2) : 0;
    
    // Time of day factor (late night/early morning are higher risk)
    const timeOfDay = contextualFactors.timeOfDay ?? 12;
    const timeRiskFactor = (timeOfDay >= 22 || timeOfDay <= 6) ? 1.2 : 1;
    
    // Consecutive negative messages
    const consecutiveFactor = contextualFactors.consecutiveNegativeMessages ?
      Math.min(contextualFactors.consecutiveNegativeMessages * 0.5, 2) : 0;
    
    const totalScore = (baseScore + keywordSeverity + historyMultiplier + consecutiveFactor) * timeRiskFactor;
    
    return Math.min(Math.max(Math.round(totalScore), 1), 10);
  }

  /**
   * Determine urgency level based on crisis score
   */
  static getUrgencyLevel(crisisLevel: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (crisisLevel <= 3) return 'low';
    if (crisisLevel <= 6) return 'moderate';
    if (crisisLevel <= 8) return 'high';
    return 'critical';
  }

  /**
   * Get recommended response time based on crisis level
   */
  static getResponseTimeLimit(crisisLevel: number): number {
    if (crisisLevel <= 3) return 300; // 5 minutes
    if (crisisLevel <= 6) return 120; // 2 minutes
    if (crisisLevel <= 8) return 60;  // 1 minute
    return 30; // 30 seconds for critical
  }

  /**
   * Check if immediate escalation is required
   */
  static requiresImmediateEscalation(crisisLevel: number, keywords: string[]): boolean {
    const emergencyKeywords = ['suicide', 'kill myself', 'end it all', 'overdose', 'hurt someone'];
    const hasEmergencyKeywords = keywords.some(keyword => 
      emergencyKeywords.some(emergency => keyword.toLowerCase().includes(emergency))
    );
    
    return crisisLevel >= 8 || hasEmergencyKeywords;
  }
}

/**
 * Encryption utilities for HIPAA compliance
 */
export class EncryptionUtils {
  /**
   * Generate a secure encryption key ID
   */
  static generateKeyId(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Mask sensitive information for logging
   */
  static maskSensitiveData(data: string): string {
    // Email masking
    data = data.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, 
      (match, p1, p2) => `${p1.charAt(0)}***@${p2}`);
    
    // Phone number masking
    data = data.replace(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
      '***-***-$4');
    
    // SSN masking
    data = data.replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '***-**-****');
    
    return data;
  }

  /**
   * Generate audit trail hash
   */
  static generateAuditHash(data: object): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    // In a real implementation, use a proper hashing library
    return btoa(str).substr(0, 16);
  }
}

/**
 * Language detection and processing utilities
 */
export class LanguageUtils {
  /**
   * Detect language from text (placeholder - would use actual ML model)
   */
  static detectLanguage(text: string): string {
    // Simple heuristic for demo - in production use proper language detection
    const arabicPattern = /[\u0600-\u06FF]/;
    const hindiPattern = /[\u0900-\u097F]/;
    const spanishWords = ['el', 'la', 'es', 'de', 'que', 'y', 'en', 'un', 'ser', 'se'];
    const frenchWords = ['le', 'la', 'est', 'de', 'que', 'et', 'en', 'un', 'être', 'se'];
    const germanWords = ['der', 'die', 'das', 'ist', 'von', 'und', 'in', 'ein', 'sein', 'sich'];
    
    if (arabicPattern.test(text)) return 'ar';
    if (hindiPattern.test(text)) return 'hi';
    
    const words = text.toLowerCase().split(/\s+/);
    const spanishScore = words.filter(word => spanishWords.includes(word)).length;
    const frenchScore = words.filter(word => frenchWords.includes(word)).length;
    const germanScore = words.filter(word => germanWords.includes(word)).length;
    
    if (spanishScore > frenchScore && spanishScore > germanScore) return 'es';
    if (frenchScore > germanScore) return 'fr';
    if (germanScore > 0) return 'de';
    
    return 'en'; // Default to English
  }

  /**
   * Get crisis keywords for a specific language
   */
  static getCrisisKeywords(language: string): string[] {
    const keywords: Record<string, string[]> = {
      en: ['suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself'],
      es: ['suicidio', 'matarme', 'terminar todo', 'quiero morir', 'lastimarme'],
      fr: ['suicide', 'me tuer', 'tout finir', 'veux mourir', 'me blesser'],
      de: ['selbstmord', 'mich umbringen', 'alles beenden', 'sterben wollen', 'mich verletzen'],
      hi: ['आत्महत्या', 'खुद को मारना', 'सब कुछ खत्म', 'मरना चाहता हूं', 'खुद को नुकसान'],
      ar: ['انتحار', 'قتل نفسي', 'إنهاء كل شيء', 'أريد أن أموت', 'إيذاء نفسي']
    };
    
    return keywords[language] || keywords.en;
  }
}

/**
 * Time and scheduling utilities
 */
export class TimeUtils {
  /**
   * Check if current time is within business hours for a timezone
   */
  static isBusinessHours(timezone: string): boolean {
    const now = dayjs().tz(timezone);
    const hour = now.hour();
    const day = now.day(); // 0 = Sunday, 6 = Saturday
    
    // Business hours: Monday-Friday 9 AM - 6 PM
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }

  /**
   * Calculate next available business hour
   */
  static getNextBusinessHour(timezone: string): Date {
    let next = dayjs().tz(timezone);
    
    // If it's weekend, move to Monday
    if (next.day() === 0) next = next.add(1, 'day'); // Sunday -> Monday
    if (next.day() === 6) next = next.add(2, 'day'); // Saturday -> Monday
    
    // If after business hours, move to next business day
    if (next.hour() >= 18) {
      next = next.add(1, 'day').hour(9).minute(0).second(0);
      // Check if it's weekend again
      if (next.day() === 6) next = next.add(2, 'day');
      if (next.day() === 0) next = next.add(1, 'day');
    }
    
    // If before business hours, set to 9 AM
    if (next.hour() < 9) {
      next = next.hour(9).minute(0).second(0);
    }
    
    return next.toDate();
  }

  /**
   * Format relative time for user display
   */
  static formatRelativeTime(date: Date): string {
    return dayjs(date).fromNow();
  }

  /**
   * Check if a timestamp is within HIPAA retention period
   */
  static isWithinRetentionPeriod(date: Date): boolean {
    const retentionYears = 7; // HIPAA requirement
    const cutoffDate = dayjs().subtract(retentionYears, 'year');
    return dayjs(date).isAfter(cutoffDate);
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }

  /**
   * Check if text contains potential PHI (Protected Health Information)
   */
  static containsPHI(text: string): boolean {
    const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/;
    const creditCardPattern = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/;
    const dobPattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/;
    
    return ssnPattern.test(text) || creditCardPattern.test(text) || dobPattern.test(text);
  }
}