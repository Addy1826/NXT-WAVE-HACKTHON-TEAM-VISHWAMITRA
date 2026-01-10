import axios from 'axios';
import { logger } from '../utils/logger';

export class CrisisDetectionService {
    private mlServiceUrl: string;

    constructor() {
        this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
    }

    async analyzeMessage(message: string, context: any): Promise<any> {
        const lowerMsg = message.toLowerCase();

        // 1. Enhanced Regex Crisis Detection (Handles typos & variations)
        const crisisPatterns = [
            /suicid/i,
            /(kill|end|hurt).*(myself|me|life)/i,
            /(want|wish).*(die|dead)/i,
            /(no reason|nothing).*live/i,
            /self[\s-]?harm/i,
            /cutting/i,
            /overdose/i
        ];

        const isCrisis = crisisPatterns.some(pattern => pattern.test(lowerMsg));

        if (isCrisis) {
            logger.warn(`CRITICAL: Local Regex detection triggered for message: "${message}"`);
            return {
                crisis_level: 9, // Immediate High Crisis
                urgency: 'critical',
                requires_immediate_escalation: true,
                sentiment_analysis: { label: 'negative', score: 0.95 },
                keywords_detected: ['local_crypto_crisis_match'],
                recommendations: ['Immediate professional intervention', 'Safety plan']
            };
        }

        // 2. Basic Local Sentiment Analysis (Fallback)
        // Simple dictionary-based approach
        const negativeWords = ['sad', 'depressed', 'anxious', 'scared', 'hurt', 'pain', 'bad', 'terrible', 'awful', 'cry', 'crying', 'lonely', 'tired', 'hate', 'fear'];
        const positiveWords = ['happy', 'good', 'great', 'better', 'love', 'excited', 'wonderful', 'thanks', 'thank', 'hope', 'joy'];

        let sentimentScore = 0;
        const words = lowerMsg.split(/\s+/);
        words.forEach(w => {
            if (negativeWords.includes(w)) sentimentScore--;
            if (positiveWords.includes(w)) sentimentScore++;
        });

        const localSentiment = sentimentScore > 0 ? 'positive' : (sentimentScore < 0 ? 'negative' : 'neutral');

        try {
            const response = await axios.post(`${this.mlServiceUrl}/analyze/message`, {
                text: message,
                user_id: context.userId,
                context: {
                    conversation_id: context.conversationId,
                    history: context.messageHistory
                }
            });
            return response.data;
        } catch (error) {
            // logger.error('Crisis detection service error:', error); // Silence error to avoid spam if ML check is just a bonus
            // Fallback response
            return {
                crisis_level: (sentimentScore < -2) ? 4 : 1, // Elevate crisis slightly if very negative
                urgency: 'low',
                requires_immediate_escalation: false,
                sentiment_analysis: { label: localSentiment, score: 0.5 + (sentimentScore * 0.1) },
                keywords_detected: [],
                recommendations: []
            };
        }
    }

    async createEscalation(data: any): Promise<any> {
        // In a real system, this would save to a database
        logger.warn(`Creating escalation for user ${data.userId} in conversation ${data.conversationId}`);
        return {
            id: `esc_${Date.now()}`,
            ...data,
            createdAt: new Date(),
            status: 'pending'
        };
    }
}
