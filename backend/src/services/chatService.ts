import Chat, { IChat } from '../models/Chat';
import Conversation, { IConversation } from '../models/Conversation';
import { logger } from '../utils/logger';
import { GeminiService } from './geminiService';

import mongoose from 'mongoose';

// In-memory storage
const localChats: any[] = [];
const localConversations: any[] = [];

export class ChatService {
    private geminiService: GeminiService;

    constructor() {
        this.geminiService = new GeminiService();
    }

    async getUserConversations(userId: string): Promise<IConversation[]> {
        if (mongoose.connection.readyState !== 1) {
            return localConversations.filter(c => c.participants.includes(userId)) as any;
        }

        return await Conversation.find({ participants: userId })
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'name avatar' }
            })
            .populate('participants', 'name avatar')
            .sort({ updatedAt: -1 })
            .exec();
    }

    async createConversation(participants: string[], type: 'direct' | 'group', groupName?: string, groupAdmin?: string): Promise<IConversation> {
        if (mongoose.connection.readyState !== 1) {
            const conv = {
                _id: 'local_conv_' + Date.now(),
                participants,
                type,
                groupName,
                groupAdmin,
                createdAt: new Date(),
                updatedAt: new Date()
            } as any;
            localConversations.push(conv);
            return conv;
        }

        // For direct chats, check if one already exists
        if (type === 'direct' && participants.length === 2) {
            const existing = await Conversation.findOne({
                participants: { $all: participants },
                type: 'direct'
            });
            if (existing) return existing;
        }

        const conversation = new Conversation({
            participants,
            type,
            groupName,
            groupAdmin
        });

        return await conversation.save();
    }

    async saveMessage(data: { conversationId: string; userId: string; content: string; type: string; timestamp: Date; metadata?: any }): Promise<IChat> {
        try {
            if (mongoose.connection.readyState !== 1) {
                const chat = {
                    _id: 'local_msg_' + Date.now(),
                    conversationId: data.conversationId,
                    sender: data.userId === 'bot' ? null : data.userId,
                    content: data.content,
                    type: data.type,
                    metadata: data.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as any;
                localChats.push(chat);

                // Update local conversation
                const convIndex = localConversations.findIndex(c => c._id === data.conversationId);
                if (convIndex !== -1) {
                    localConversations[convIndex].lastMessage = chat;
                    localConversations[convIndex].updatedAt = new Date();
                }

                return chat;
            }

            const chat = new Chat({
                conversationId: data.conversationId,
                sender: data.userId === 'bot' ? null : data.userId, // Handle bot user
                content: data.content,
                type: data.type,
                metadata: data.metadata
            });

            await chat.save();

            // Update conversation last message
            await Conversation.findByIdAndUpdate(data.conversationId, {
                lastMessage: chat._id,
                updatedAt: new Date()
            });

            return chat;
        } catch (error) {
            logger.error('Error saving message:', error);
            throw error;
        }
    }

    async getRecentMessages(conversationId: string, limit: number): Promise<IChat[]> {
        if (mongoose.connection.readyState !== 1) {
            return localChats
                .filter(c => c.conversationId === conversationId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit);
        }

        return await Chat.find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'name avatar')
            .exec();
    }

    async generateBotResponse(message: string, analysis: any, conversationId: string): Promise<any> {
        console.log('[DEBUG] generateBotResponse called');
        try {
            // Retrieve recent context to pass to the LLM
            let history = "";
            try {
                const recentMessages = await this.getRecentMessages(conversationId, 5);
                history = recentMessages.reverse().map(m => {
                    const sender = m.sender ? 'User' : 'Assistant';
                    return `${sender}: ${m.content}`;
                }).join('\n');
            } catch (err) {
                console.warn('Could not fetch history, continuing without it', err);
            }

            const crisisLevel = analysis.crisis_level || 1;
            const sentiment = analysis.sentiment_analysis?.label || 'neutral';
            const keywords = analysis.keywords_detected || [];

            const prompt = `
You are a compassionate, empathetic mental health support assistant named "Serenity".
Your goal is to provide a safe space for the user to express themselves.

ANALYSIS CONTEXT:
- Crisis Level: ${crisisLevel}/10
- Sentiment: ${sentiment}
- Detected Keywords: ${keywords.join(', ')}

CONVERSATION HISTORY:
${history}

CURRENT USER MESSAGE:
"${message}"

INSTRUCTIONS:
1. **Safety First**: If the user indicates self-harm, suicide, or extreme distress (Crisis Level > 5 or keywords like suicide/kill):
   - Acknowledge their pain validation.
   - You MUST include these resources in a distinct, caring way: "Suicide & Crisis Lifeline: 988" and "Crisis Text Line: Text HOME to 741741".
   - Do NOT be robotic. Be warm but firm on safety.
2. **Empathy**: Reflect back what the user is feeling. Use "I hear you..." or "It sounds like...".
3. **Guidance**: Ask gentle open-ended questions to help them explore their feelings, or suggest simple grounding techniques (breathing, 5-4-3-2-1) if they seem anxious.
4. **Brevity**: Keep responses concise (2-3 sentences max usually) unless deep explanation is needed. This is a chat.
5. **Tone**: Warm, non-judgmental, patience.

Respond now as Serenity:
`;

            const responseContent = await this.geminiService.generateResponse(prompt);
            console.log('[DEBUG] Gemini response received');

            let suggestions = ['Tell me more', 'I am listening', 'Thank you'];
            if (crisisLevel >= 7 || responseContent.includes('988')) {
                suggestions = ['Call 988', 'Crisis Resources', 'I will stay safe'];
            } else if (sentiment === 'negative') {
                suggestions = ['I feel overwhelmed', 'It is hard', 'I need a distraction'];
            } else if (sentiment === 'positive') {
                suggestions = ['I am proud of myself', 'Things are looking up', 'Thanks for asking'];
            }

            return {
                content: responseContent.trim(),
                type: 'bot_response',
                suggestions: suggestions
            };

        } catch (error) {
            logger.error('Failed to generate response from Gemini, falling back to static logic:', error);
            return this.getFallbackResponse(message, analysis);
        }
    }

    private getFallbackResponse(message: string, analysis: any): any {
        const crisisLevel = analysis.crisis_level || 1;
        const sentiment = analysis.sentiment_analysis?.label || 'neutral';

        if (crisisLevel >= 7) {
            return {
                content: "I'm detecting that you're going through a very difficult moment. I want to ensure you're safe. Please reach out to the Suicide & Crisis Lifeline by calling 988. I am just a bot, but your life matters.",
                type: 'bot_response',
                suggestions: ['Call 988', 'Emergency Resources']
            };
        }

        if (sentiment === 'negative') {
            return {
                content: "I'm sorry you're feeling this way. I'm here to listen. Can you tell me more about what's going on?",
                type: 'bot_response',
                suggestions: ['I am sad', 'I am stressed']
            };
        }

        return {
            content: "I'm listening. Please go on.",
            type: 'bot_response',
            suggestions: ['Tell me more', 'Just venting']
        };
    }

    async processVoiceMessage(data: any): Promise<any> {
        // Placeholder for voice processing (STT)
        // In the future, we could use Gemini 1.5 Pro's audio capabilities too!
        return {
            transcription: "Voice message processing not yet implemented.",
            sentiment: "neutral"
        };
    }
}
