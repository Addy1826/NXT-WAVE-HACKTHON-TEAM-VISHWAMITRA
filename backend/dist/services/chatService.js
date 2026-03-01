"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const logger_1 = require("../utils/logger");
const geminiService_1 = require("./geminiService");
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
// Load bot personality configuration
const personalityConfigPath = path_1.default.join(__dirname, '../config/bot-personality.json');
const botPersonality = fs_1.default.existsSync(personalityConfigPath)
    ? JSON.parse(fs_1.default.readFileSync(personalityConfigPath, 'utf-8'))
    : null;
// In-memory storage
const localChats = [];
const localConversations = [];
class ChatService {
    constructor(io) {
        this.io = null;
        this.geminiService = new geminiService_1.GeminiService();
        this.io = io || null;
        this.ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    }
    async getUserConversations(userId) {
        if (mongoose_1.default.connection.readyState !== 1) {
            return localConversations.filter(c => c.participants.includes(userId));
        }
        const conversations = await Conversation_1.default.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .lean()
            .exec();
        // Populate participants using Mongoose User model
        const participantIds = Array.from(new Set(conversations.flatMap(c => c.participants)))
            .filter(id => id !== 'bot');
        const users = await User_1.default.find({ _id: { $in: participantIds } })
            .select('name role')
            .lean();
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));
        // Combine data
        return conversations.map(c => ({
            ...c,
            participants: c.participants.map(pid => {
                if (pid === 'bot')
                    return { _id: 'bot', name: 'AI Assistant', avatar: null };
                const u = userMap.get(pid);
                return u ? { _id: u._id, name: u.name, role: u.role } : { _id: pid, name: 'Unknown User' };
            })
        }));
    }
    async createConversation(participants, type, groupName, groupAdmin) {
        if (mongoose_1.default.connection.readyState !== 1) {
            const conv = {
                _id: 'local_conv_' + Date.now(),
                participants,
                type,
                groupName,
                groupAdmin,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            localConversations.push(conv);
            return conv;
        }
        // For direct chats, check if one already exists
        if (type === 'direct' && participants.length === 2) {
            const existing = await Conversation_1.default.findOne({
                participants: { $all: participants },
                type: 'direct'
            });
            if (existing)
                return existing;
        }
        const conversation = new Conversation_1.default({
            participants,
            type,
            groupName,
            groupAdmin
        });
        return await conversation.save();
    }
    /**
     * Analyze message for crisis indicators using ML service
     */
    async analyzeCrisis(message, userId) {
        try {
            const response = await axios_1.default.post(`${this.ML_SERVICE_URL}/analyze/message`, {
                text: message,
                context: { userId }
            }, {
                timeout: 5000 // 5 second timeout
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.warn('ML service unavailable, using fallback crisis detection:', error.message);
            // Fallback: Simple keyword-based detection
            return this.fallbackCrisisDetection(message);
        }
    }
    /**
     * Fallback crisis detection when ML service is down
     */
    fallbackCrisisDetection(message) {
        const lowerMessage = message.toLowerCase();
        const criticalKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live'];
        const highKeywords = ['hopeless', 'worthless', 'can\'t go on', 'give up', 'self-harm'];
        const moderateKeywords = ['depressed', 'anxious', 'panic', 'overwhelmed', 'scared'];
        let crisisLevel = 1;
        const detectedKeywords = [];
        for (const keyword of criticalKeywords) {
            if (lowerMessage.includes(keyword)) {
                crisisLevel = 9;
                detectedKeywords.push(keyword);
            }
        }
        if (crisisLevel < 9) {
            for (const keyword of highKeywords) {
                if (lowerMessage.includes(keyword)) {
                    crisisLevel = Math.max(crisisLevel, 7);
                    detectedKeywords.push(keyword);
                }
            }
        }
        if (crisisLevel < 7) {
            for (const keyword of moderateKeywords) {
                if (lowerMessage.includes(keyword)) {
                    crisisLevel = Math.max(crisisLevel, 4);
                    detectedKeywords.push(keyword);
                }
            }
        }
        return {
            crisis_level: crisisLevel,
            urgency: crisisLevel >= 8 ? 'critical' : crisisLevel >= 5 ? 'high' : 'low',
            keywords_detected: detectedKeywords,
            sentiment_analysis: { label: crisisLevel >= 5 ? 'negative' : 'neutral' },
            recommendations: crisisLevel >= 8 ? ['immediate_intervention'] : []
        };
    }
    async saveMessage(data) {
        try {
            // Analyze message for crisis indicators (only for user messages, not bot)
            let crisisAnalysis = null;
            if (data.userId !== 'bot') {
                crisisAnalysis = await this.analyzeCrisis(data.content, data.userId);
                // Emit crisis event if level >= 8
                if (this.io && crisisAnalysis.crisis_level >= 8) {
                    const roomName = `user_${data.userId}`;
                    logger_1.logger.info(`Emitting crisis:detected to room ${roomName} (level: ${crisisAnalysis.crisis_level})`);
                    // Emit to patient's room (for crisis modal)
                    this.io.to(roomName).emit('crisis:detected', {
                        crisisLevel: crisisAnalysis.crisis_level,
                        urgency: crisisAnalysis.urgency,
                        keywords: crisisAnalysis.keywords_detected || [],
                        sentiment: crisisAnalysis.sentiment_analysis?.label || 'unknown',
                        recommendations: crisisAnalysis.recommendations || []
                    });
                    // BROADCAST to all online therapists (the "Bat Signal")
                    logger_1.logger.info(`Broadcasting therapist:crisis_alert to all therapists (level: ${crisisAnalysis.crisis_level})`);
                    this.io.emit('therapist:crisis_alert', {
                        crisisLevel: crisisAnalysis.crisis_level,
                        urgency: crisisAnalysis.urgency,
                        keywords: crisisAnalysis.keywords_detected || [],
                        sentiment: crisisAnalysis.sentiment_analysis?.label || 'unknown',
                        userId: data.userId,
                        timestamp: new Date().toISOString()
                    });
                }
                // Add crisis data to metadata
                data.metadata = {
                    ...data.metadata,
                    crisisLevel: crisisAnalysis.crisis_level,
                    crisisAnalysis
                };
            }
            if (mongoose_1.default.connection.readyState !== 1) {
                const chat = {
                    _id: 'local_msg_' + Date.now(),
                    conversationId: data.conversationId,
                    sender: data.userId === 'bot' ? 'bot' : data.userId,
                    content: data.content,
                    type: data.type,
                    metadata: data.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                localChats.push(chat);
                // Update local conversation
                const convIndex = localConversations.findIndex(c => c._id === data.conversationId);
                if (convIndex !== -1) {
                    localConversations[convIndex].lastMessage = chat;
                    localConversations[convIndex].updatedAt = new Date();
                }
                return chat;
            }
            const chat = new Chat_1.default({
                conversationId: data.conversationId,
                sender: data.userId === 'bot' ? 'bot' : data.userId,
                content: data.content,
                type: data.type,
                metadata: data.metadata
            });
            await chat.save();
            // Update conversation last message
            await Conversation_1.default.findByIdAndUpdate(data.conversationId, {
                lastMessage: chat._id,
                updatedAt: new Date()
            });
            return chat;
        }
        catch (error) {
            logger_1.logger.error('Error saving message:', error);
            throw error;
        }
    }
    async getRecentMessages(conversationId, limit) {
        if (mongoose_1.default.connection.readyState !== 1) {
            return localChats
                .filter(c => c.conversationId === conversationId)
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit);
        }
        const messages = await Chat_1.default.find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
        // Populate sender details using Mongoose User Model
        const senderIds = Array.from(new Set(messages.map((m) => m.sender).filter(s => s && s !== 'bot')));
        const users = await User_1.default.find({ _id: { $in: senderIds } })
            .select('name')
            .lean();
        const userMap = new Map(users.map((u) => [u._id.toString(), u]));
        return messages.map((m) => {
            let senderDetails = null;
            if (m.sender === 'bot') {
                senderDetails = { _id: 'bot', name: 'Mindora (AI)' };
            }
            else if (m.sender) {
                const u = userMap.get(m.sender.toString());
                senderDetails = u ? { _id: u._id, name: u.name } : { _id: m.sender, name: 'Unknown' };
            }
            return {
                ...m,
                sender: senderDetails
            };
        });
    }
    async generateBotResponse(message, analysis, conversationId) {
        console.log('[DEBUG] generateBotResponse called');
        try {
            const crisisLevel = analysis.crisis_level || 1;
            const sentiment = analysis.sentiment_analysis?.label || 'neutral';
            const keywords = analysis.keywords_detected || [];
            // For critical crisis (>= 8), use brief response since modal will appear
            if (crisisLevel >= 8) {
                return {
                    content: "I see you're going through a very difficult time. Please look at the screen—there's immediate help available for you. You're not alone.",
                    type: 'bot_response',
                    suggestions: ['I need help now']
                };
            }
            // Retrieve recent context to pass to the LLM
            let history = "";
            try {
                const recentMessages = await this.getRecentMessages(conversationId, 5);
                history = recentMessages.reverse().map(m => {
                    const sender = m.sender ? 'User' : 'Assistant';
                    return `${sender}: ${m.content}`;
                }).join('\n');
            }
            catch (err) {
                console.warn('Could not fetch history, continuing without it', err);
            }
            // Build system prompt from bot-personality.json if available
            let systemPrompt = botPersonality?.system_prompt?.base || '';
            // Use response template based on crisis level
            let guidanceNote = '';
            if (botPersonality?.system_prompt?.response_templates) {
                const templates = botPersonality.system_prompt.response_templates;
                if (crisisLevel >= 7 && templates.crisis_level_7_8) {
                    guidanceNote = `\nExample tone: "${templates.crisis_level_7_8.example}"`;
                }
                else if (crisisLevel >= 4 && templates.crisis_level_4_6) {
                    guidanceNote = `\nExample tone: "${templates.crisis_level_4_6.example}"`;
                }
                else if (templates.crisis_level_1_3) {
                    guidanceNote = `\nExample tone: "${templates.crisis_level_1_3.example}"`;
                }
            }
            const prompt = `${systemPrompt}

ANALYSIS CONTEXT:
- Crisis Level: ${crisisLevel}/10
- Sentiment: ${sentiment}
- Detected Keywords: ${keywords.join(', ')}
${guidanceNote}

CONVERSATION HISTORY:
${history}

CURRENT USER MESSAGE:
"${message}"

Respond with empathy and care:
`;
            const responseContent = await this.geminiService.generateResponse(prompt);
            console.log('[DEBUG] Gemini response received');
            let suggestions = ['Tell me more', 'I am listening', 'Thank you'];
            if (crisisLevel >= 5) {
                suggestions = ['I need support', 'Talk to therapist', 'Crisis resources'];
            }
            else if (sentiment === 'negative') {
                suggestions = ['I feel overwhelmed', 'It is hard', 'I need a distraction'];
            }
            else if (sentiment === 'positive') {
                suggestions = ['I am proud of myself', 'Things are looking up', 'Thanks for asking'];
            }
            return {
                content: responseContent.trim(),
                type: 'bot_response',
                suggestions: suggestions
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to generate response from Gemini, falling back to static logic:', error);
            return this.getFallbackResponse(message, analysis);
        }
    }
    getFallbackResponse(message, analysis) {
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
    async processVoiceMessage(data) {
        // Placeholder for voice processing (STT)
        // In the future, we could use Gemini 1.5 Pro's audio capabilities too!
        return {
            transcription: "Voice message processing not yet implemented.",
            sentiment: "neutral"
        };
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chatService.js.map