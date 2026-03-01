import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { validateEnv } from './config/validateEnv';
import { connectDatabase } from './config/database';

import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { auditLogger } from './middleware/auditLogger';
import { authMiddleware } from './middleware/auth';

import { ChatService } from './services/chatService';
import { CrisisDetectionService } from './services/crisisDetectionService';
import { TherapistMatchingService } from './services/therapistMatchingService';
import { NotificationService } from './services/notificationService';

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

// Validate ENV
validateEnv();

class MentalHealthServer {
    private app: express.Application;
    private server: any;
    private io: SocketIOServer;
    private port: number;

    private chatService!: ChatService;
    private crisisService!: CrisisDetectionService;
    private therapistService!: TherapistMatchingService;
    private notificationService!: NotificationService;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.port = Number(process.env.PORT || 3001);

        // SOCKET.IO (ALLOW ALL ORIGINS)
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: true,
                credentials: true,
                methods: ['GET', 'POST']
            },
            transports: ['websocket', 'polling']
        });

        this.initializeServices();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSockets();
        this.setupErrors();
    }

    private initializeServices() {
        this.chatService = new ChatService(this.io);
        this.crisisService = new CrisisDetectionService();
        this.therapistService = new TherapistMatchingService();
        this.notificationService = new NotificationService();
    }

    private setupMiddleware() {
        // HELMET (FIXED CSP)
        this.app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'", "*"],
                        styleSrc: ["'self'", "'unsafe-inline'", "*"],
                        imgSrc: ["'self'", "data:", "https:", "*"],
                        connectSrc: ["'self'", "*", "ws:", "wss:"],
                        fontSrc: ["'self'", "data:", "*"],
                        frameSrc: ["'self'", "*"],
                        mediaSrc: ["'self'", "blob:", "*"],
                        objectSrc: ["'none'"]
                    }
                },
                crossOriginEmbedderPolicy: false
            })
        );

        // CORS (ALLOW ALL)
        this.app.use(
            cors({
                origin: true,
                credentials: true
            })
        );

        // RATE LIMIT
        this.app.use(
            '/api',
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100,
                standardHeaders: true,
                legacyHeaders: false
            })
        );

        // BODY PARSING
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // CUSTOM
        this.app.use(auditLogger);

        // HEALTH CHECK
        this.app.get('/health', (_, res) => {
            res.json({
                status: 'ok',
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            });
        });
    }

    private setupRoutes() {
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

        // ML ANALYZE PROXY
        this.app.post('/api/analyze', authMiddleware, async (req, res) => {
            try {
                const mlUrl = `${process.env.ML_SERVICE_URL}/analyze/message`;
                const response = await fetch(mlUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: req.headers.authorization || ''
                    },
                    body: JSON.stringify(req.body)
                });

                const data = await response.json();
                res.status(response.status).json(data);
            } catch (err) {
                logger.error(err);
                res.status(502).json({ error: 'ML Service unavailable' });
            }
        });

        // 404
        this.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    private setupSockets() {
        this.io.use((socket, next) => {
            if (!socket.handshake.auth?.token) {
                return next(new Error('Auth token required'));
            }
            next();
        });

        this.io.on('connection', socket => {
            logger.info(`Socket connected: ${socket.id}`);

            socket.on('chat:message', async data => {
                try {
                    await this.chatService.saveMessage(data);
                } catch (err) {
                    logger.error(err);
                }
            });

            socket.on('disconnect', reason => {
                logger.info(`Socket disconnected ${socket.id}: ${reason}`);
            });
        });
    }

    private setupErrors() {
        this.app.use(errorHandler);

        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
    }

    private shutdown() {
        logger.info('Shutting down server...');
        this.server.close(() => process.exit(0));
    }

    public get appInstance(): express.Application {
        return this.app;
    }

    public async start() {
        try {
            await connectDatabase().catch(err => logger.warn(err));

            // Only listen if not running on Vercel
            if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
                this.server.listen(this.port, () => {
                    logger.info(`🚀 Server running on port ${this.port}`);
                });
            }
        } catch (err) {
            logger.error(err);
            process.exit(1);
        }
    }
}

// START SERVER
const serverInstance = new MentalHealthServer();

// Start database connections
serverInstance.start();

// Export the Express app for Vercel
export default serverInstance.appInstance;
