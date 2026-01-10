import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { NotificationService } from './services/notificationService';

import logger from './utils/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import { auditLogger } from './middleware/auditLogger';
import { encryptionMiddleware } from './middleware/encryption';
import { authMiddleware } from './middleware/auth';

import { ChatService } from './services/chatService';
import { CrisisDetectionService } from './services/crisisDetectionService';
import { TherapistMatchingService } from './services/therapistMatchingService';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import userRoutes from './routes/user';
import therapistRoutes from './routes/therapist';
import paymentRoutes from './routes/payment';
import crisisRoutes from './routes/crisis';
import sessionRoutes from './routes/session';
import videoRoutes from './routes/video';
import servicesRoutes from './routes/services';
import newsRoutes from './routes/news';
import appointmentRoutes from './routes/appointment';

import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

class MentalHealthServer {
    private app: express.Application;
    private server: any;
    private io: SocketIOServer;
    private port: number;

    // Services
    private chatService!: ChatService;
    private crisisDetectionService!: CrisisDetectionService;
    private therapistMatchingService!: TherapistMatchingService;
    private notificationService!: NotificationService;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.port = parseInt(process.env.PORT || '3001');

        // Initialize Socket.IO
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: [
                    process.env.FRONTEND_URL || "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:5174"
                ],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });

        // Initialize services
        this.initializeServices();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketHandlers();
        this.setupErrorHandling();
    }

    private initializeServices(): void {
        // Pass Socket.IO instance to ChatService for crisis detection emissions
        this.chatService = new ChatService(this.io);
        this.crisisDetectionService = new CrisisDetectionService();
        this.therapistMatchingService = new TherapistMatchingService();
        this.notificationService = new NotificationService();
    }

    private setupMiddleware(): void {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "ws:", "wss:"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },
            crossOriginEmbedderPolicy: false
        }));

        // CORS configuration
        this.app.use(cors({
            origin: [
                process.env.FRONTEND_URL || "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174"
            ],
            credentials: true,
            optionsSuccessStatus: 200
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', limiter);

        // More restrictive rate limit for crisis detection
        const crisisLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 10, // limit each IP to 10 crisis detection requests per minute
            message: 'Crisis detection rate limit exceeded.',
        });
        this.app.use('/api/crisis', crisisLimiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Custom middleware
        this.app.use(auditLogger);
        this.app.use(encryptionMiddleware);

        // Health check endpoint (before auth)
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.env.npm_package_version || '1.0.0'
            });
        });
    }

    private setupRoutes(): void {
        // Apply authentication middleware to protected routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/chat', authMiddleware, chatRoutes);
        this.app.use('/api/users', authMiddleware, userRoutes);
        this.app.use('/api/therapists', authMiddleware, therapistRoutes);
        this.app.use('/api/payments', authMiddleware, paymentRoutes);
        this.app.use('/api/crisis', authMiddleware, crisisRoutes);
        this.app.use('/api/sessions', authMiddleware, sessionRoutes);
        this.app.use('/api/video', authMiddleware, videoRoutes);
        this.app.use('/api/services', authMiddleware, servicesRoutes);
        this.app.use('/api/news', authMiddleware, newsRoutes);
        this.app.use('/api/appointments', authMiddleware, appointmentRoutes);

        // Analyze proxy to ML service
        this.app.post('/api/analyze', authMiddleware, async (req, res) => {
            try {
                const mlBaseUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
                const url = `${mlBaseUrl}/analyze/message`;

                // Ensure fetch is available (Node >=18). Use global fetch via any to avoid TS lib dom requirement.
                const globalFetch: any = (global as any).fetch;
                if (!globalFetch) {
                    return res.status(500).json({ error: 'Fetch API not available in runtime' });
                }

                const response = await globalFetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Forward bearer token if present; ML service accepts any non-"invalid" token currently
                        'Authorization': req.headers['authorization'] || ''
                    },
                    body: JSON.stringify({
                        text: req.body?.text,
                        language: req.body?.language ?? 'auto',
                        context: req.body?.context ?? null,
                        user_id: req.body?.user_id ?? null,
                        include_individual_results: req.body?.include_individual_results ?? true
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    return res.status(response.status).json({
                        error: 'ML service error',
                        status: response.status,
                        details: data
                    });
                }

                return res.status(200).json(data);
            } catch (error: any) {
                logger.error('Analyze proxy error:', error);
                return res.status(502).json({ error: 'Failed to contact ML service' });
            }
        });

        // API documentation
        this.app.get('/api/docs', (req, res) => {
            res.json({
                title: 'Mental Health Chatbot API',
                version: '1.0.0',
                description: 'API endpoints for the mental health crisis detection chatbot',
                endpoints: {
                    auth: '/api/auth',
                    chat: '/api/chat',
                    users: '/api/users',
                    therapists: '/api/therapists',
                    crisis: '/api/crisis',
                    sessions: '/api/sessions',
                    video: '/api/video',
                    appointments: '/api/appointments'
                }
            });
        });

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Route not found',
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            });
        });
    }

    private setupSocketHandlers(): void {
        this.io.use(async (socket, next) => {
            try {
                // Authenticate socket connection
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication token required'));
                }

                // Verify token and get user info (implement proper JWT verification)
                // const user = await verifyJWT(token);
                // (socket as any).userId = user.id;
                // (socket as any).userRole = user.role;

                // For now, just log the connection
                logger.info(`Socket connection attempt: ${socket.id}`);
                next();
            } catch (error) {
                logger.error('Socket authentication failed:', error);
                next(new Error('Authentication failed'));
            }
        });

        this.io.on('connection', (socket) => {
            logger.info(`User connected: ${socket.id}`);

            // Join user to their personal room
            const userId = (socket as any).userId || socket.id;
            socket.join(`user_${userId}`);

            // Handle chat messages
            socket.on('chat:message', async (data) => {
                try {
                    await this.handleChatMessage(socket, data);
                } catch (error) {
                    logger.error('Error handling chat message:', error);
                    socket.emit('error', { message: 'Failed to process message' });
                }
            });

            // Handle typing indicators
            socket.on('typing:start', (data) => {
                socket.to(`conversation_${data.conversationId}`).emit('typing:start', {
                    userId: (socket as any).userId,
                    conversationId: data.conversationId
                });
            });

            socket.on('typing:stop', (data) => {
                socket.to(`conversation_${data.conversationId}`).emit('typing:stop', {
                    userId: (socket as any).userId,
                    conversationId: data.conversationId
                });
            });

            // Handle voice messages
            socket.on('voice:start', async (data) => {
                // Handle voice recording start
                socket.emit('voice:recording', { status: 'started' });
            });

            socket.on('voice:end', async (data) => {
                try {
                    // Process voice message (transcription, etc.)
                    const result = await this.chatService.processVoiceMessage(data);
                    socket.emit('voice:processed', result);
                } catch (error) {
                    logger.error('Voice processing error:', error);
                    socket.emit('voice:error', { message: 'Failed to process voice message' });
                }
            });

            // WebRTC Signaling
            socket.on('video:join', (roomId: any) => {
                socket.join(`video_${roomId}`);
                socket.to(`video_${roomId}`).emit('video:user_joined', socket.id);
            });

            socket.on('video:offer', (data: any) => {
                socket.to(`video_${data.roomId}`).emit('video:offer', {
                    offer: data.offer,
                    senderId: socket.id
                });
            });

            socket.on('video:answer', (data: any) => {
                socket.to(`video_${data.roomId}`).emit('video:answer', {
                    answer: data.answer,
                    senderId: socket.id
                });
            });

            socket.on('video:ice-candidate', (data: any) => {
                socket.to(`video_${data.roomId}`).emit('video:ice-candidate', {
                    candidate: data.candidate,
                    senderId: socket.id
                });
            });

            // Handle crisis escalation
            socket.on('crisis:escalate', async (data: any) => {
                try {
                    await this.handleCrisisEscalation(socket, data);
                } catch (error) {
                    logger.error('Crisis escalation error:', error);
                    socket.emit('crisis:error', { message: 'Failed to escalate crisis' });
                }
            });

            // Handle therapist assignment
            socket.on('therapist:request', async (data: any) => {
                try {
                    const assignment = await this.therapistMatchingService.requestTherapist(
                        (socket as any).userId,
                        data.preferences
                    );
                    socket.emit('therapist:assigned', assignment);
                } catch (error) {
                    logger.error('Therapist assignment error:', error);
                    socket.emit('therapist:error', { message: 'Failed to assign therapist' });
                }
            });

            // Handle disconnection
            socket.on('disconnect', (reason: any) => {
                logger.info(`User disconnected: ${socket.id}, reason: ${reason}`);
                socket.leave(`user_${userId}`);
            });

            // Handle errors
            socket.on('error', (error: any) => {
                logger.error('Socket error:', error);
            });
        });
    }

    private async handleChatMessage(socket: any, data: any): Promise<void> {
        const { conversationId, message, type = 'text' } = data;

        logger.info(`Processing message for conversation ${conversationId}`);

        // Save message to database
        const savedMessage = await this.chatService.saveMessage({
            conversationId,
            userId: (socket as any).userId || 'anonymous',
            content: message,
            type,
            timestamp: new Date()
        });

        // Perform crisis detection
        const crisisAnalysis = await this.crisisDetectionService.analyzeMessage(
            message,
            {
                userId: (socket as any).userId,
                conversationId: conversationId,
                messageHistory: await this.chatService.getRecentMessages(conversationId, 5)
            }
        );

        // Emit message to conversation participants
        this.io.to(`conversation_${conversationId}`).emit('chat:message', {
            ...savedMessage,
            crisisAnalysis: {
                level: crisisAnalysis.crisis_level,
                urgency: crisisAnalysis.urgency,
                requiresEscalation: crisisAnalysis.requires_immediate_escalation
            }
        });

        // Handle crisis escalation if needed
        if (crisisAnalysis.requires_immediate_escalation) {
            await this.handleCrisisEscalation(socket, {
                conversationId,
                crisisLevel: crisisAnalysis.crisis_level,
                analysis: crisisAnalysis
            });
        }

        // Generate bot response
        const botResponse = await this.chatService.generateBotResponse(
            message,
            crisisAnalysis,
            conversationId
        );

        if (botResponse) {
            // Save bot response
            const savedBotMessage = await this.chatService.saveMessage({
                conversationId,
                userId: 'bot',
                content: (botResponse as any).content,
                type: 'bot_response',
                timestamp: new Date(),
                metadata: {
                    responseType: (botResponse as any).type,
                    suggestions: (botResponse as any).suggestions
                }
            });

            // Emit bot response
            this.io.to(`conversation_${conversationId}`).emit('chat:message', savedBotMessage);
        }
    }

    private async handleCrisisEscalation(socket: any, data: any): Promise<void> {
        const { conversationId, crisisLevel, analysis } = data;

        logger.warn(`Crisis escalation triggered for conversation ${conversationId}, level ${crisisLevel}`);

        // Create escalation record
        const escalation = await this.crisisDetectionService.createEscalation({
            conversationId,
            userId: (socket as any).userId,
            crisisLevel,
            trigger: analysis?.keywords_detected?.join(', ') || 'Automatic detection',
            analysis
        });

        // Notify crisis response team
        await this.notificationService.notifyCrisisTeam(escalation);

        // If critical level, attempt to assign therapist immediately
        if (crisisLevel >= 8) {
            try {
                const therapistAssignment: any = await this.therapistMatchingService.assignEmergencyTherapist(
                    (socket as any).userId,
                    crisisLevel
                );

                if (therapistAssignment) {
                    socket.emit('therapist:emergency_assigned', therapistAssignment);

                    // Notify therapist
                    this.io.to(`therapist_${therapistAssignment.therapistId}`).emit('crisis:emergency_assignment', {
                        userId: (socket as any).userId,
                        conversationId,
                        crisisLevel,
                        escalationId: escalation.id
                    });
                }
            } catch (error) {
                logger.error('Emergency therapist assignment failed:', error);
            }
        }

        // Emit crisis alert to client
        socket.emit('crisis:escalated', {
            escalationId: escalation.id,
            level: crisisLevel,
            responseTime: this.getCrisisResponseTime(crisisLevel),
            resources: this.getCrisisResources(crisisLevel),
            emergencyContacts: this.getEmergencyContacts()
        });
    }

    private getCrisisResponseTime(level: number): string {
        if (level >= 9) return 'Immediate (< 1 minute)';
        if (level >= 7) return 'Urgent (< 5 minutes)';
        if (level >= 5) return 'High Priority (< 15 minutes)';
        return 'Standard (< 1 hour)';
    }

    private getCrisisResources(level: number): string[] {
        const resources = [];

        if (level >= 8) {
            resources.push('Tele MANAS (Govt of India): 14416');
            resources.push('Vandrevala Foundation: 1860-266-2345');
            resources.push('Emergency Services (All-in-one): 112');
        }

        if (level >= 5) {
            resources.push('iCall (TISS): 9152987821');
            resources.push('Parivarthan Counseling: +91 7676 602 602');
            resources.push('Professional Counselor Assignment');
        }

        resources.push('Self-Help Resources');
        resources.push('Peer Support Community');

        return resources;
    }

    private getEmergencyContacts(): any[] {
        return [
            {
                name: 'Tele MANAS (Govt of India)',
                phone: '14416',
                available: '24/7'
            },
            {
                name: 'Vandrevala Foundation',
                phone: '1860-266-2345',
                available: '24/7'
            },
            {
                name: 'Emergency Services',
                phone: '112',
                available: '24/7'
            },
            {
                name: 'iCall (TISS)',
                phone: '9152987821',
                available: 'Mon-Sat, 8 AM - 10 PM'
            }
        ];
    }

    private setupErrorHandling(): void {
        this.app.use(errorHandler);

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            this.server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });
    }

    public async start(): Promise<void> {
        try {
            // Connect to databases (Graceful degradation)
            try {
                await connectDatabase();
            } catch (err) {
                logger.warn('Database connection failed. Starting in non-persistent mode.');
                logger.error(err);
            }

            try {
                await connectRedis();
            } catch (err) {
                logger.warn('Redis connection failed. Caching and real-time features may be limited.');
                logger.error(err);
            }

            // Start server
            this.server.listen(this.port, () => {
                logger.info(`Mental Health Server running on port ${this.port}`);
                logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
                logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
            });

        } catch (error: any) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

// Create and start server
const server = new MentalHealthServer();
server.start().catch((error) => {
    logger.error('Server startup failed:', error);
    process.exit(1);
});

export default server;
