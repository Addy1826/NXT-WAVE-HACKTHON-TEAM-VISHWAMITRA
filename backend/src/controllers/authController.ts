import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Therapist from '../models/Therapist';
import prisma from '../config/prisma';
import logger from '../utils/logger';

// In-memory storage for fallback
const localUsers: any[] = [];

// JWT Configuration with explicit non-null guarantees
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_fallback_dev_only';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export const register = async (req: Request, res: Response) => {
    try {
        console.log('Register attempt:', req.body);
        const { name, email, password, role, specialization, bio, experienceYears, hourlyRate } = req.body;

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('Database not connected. Using in-memory storage.');

            const existingUser = localUsers.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                _id: 'local_' + Date.now(),
                name,
                email,
                password: hashedPassword,
                role
            };
            localUsers.push(newUser);

            const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
            console.log('Local user registered:', newUser);
            return res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        if (role === 'therapist') {
            try {
                const therapist = new Therapist({
                    user: user._id,
                    specialization: specialization || [],
                    bio: bio || '',
                    experienceYears: experienceYears || 0,
                    hourlyRate: hourlyRate || 0
                });
                await therapist.save();
            } catch (error) {
                // Rollback: Delete the user if therapist profile creation fails
                await User.findByIdAndDelete(user._id);
                console.error('Failed to create therapist profile, rolling back user:', error);
                return res.status(500).json({ message: 'Failed to create therapist profile' });
            }
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            console.warn('Database not connected. Using in-memory storage.');

            const user = localUsers.find(u => u.email === email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password || '');
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// ============================================================================
// ANONYMOUS SESSION MANAGEMENT (Prisma/PostgreSQL)
// ============================================================================

/**
 * POST /api/auth/anonymous
 * Create an anonymous session for progressive profiling
 */
export const createAnonymousSession = async (req: Request, res: Response) => {
    try {
        const { deviceFingerprint, initialEmotion, initialMessage } = req.body;

        // Validation
        if (!deviceFingerprint || typeof deviceFingerprint !== 'string') {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'deviceFingerprint is required and must be a string'
            });
        }

        if (deviceFingerprint.length < 10 || deviceFingerprint.length > 500) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'deviceFingerprint must be between 10 and 500 characters'
            });
        }

        // Check if session already exists for this device
        const existingSession = await prisma.anonymousSession.findUnique({
            where: { deviceFingerprint },
        });

        if (existingSession) {
            // Session exists - check if it's expired or converted
            if (existingSession.status === 'EXPIRED') {
                return res.status(410).json({
                    error: 'Session Expired',
                    message: 'This anonymous session has expired. Please start a new session.'
                });
            }

            if (existingSession.status === 'CONVERTED_TO_USER') {
                return res.status(409).json({
                    error: 'Session Already Converted',
                    message: 'This device is already associated with a registered account. Please log in.',
                    userId: existingSession.convertedUserId
                });
            }

            // Active session - return existing token
            const token = (jwt.sign as any)(
                {
                    sessionId: existingSession.id,
                    type: 'anonymous',
                    deviceFingerprint: existingSession.deviceFingerprint
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            logger.info(`Existing anonymous session retrieved: ${existingSession.id}`);

            return res.status(200).json({
                token,
                sessionId: existingSession.id,
                messageCount: existingSession.messageCount,
                maxFreeMessages: existingSession.maxFreeMessages,
                isExisting: true
            });
        }

        // Create new anonymous session
        const temporaryName = `Guest_${Math.random().toString(36).substring(2, 8)}`;

        const newSession = await prisma.anonymousSession.create({
            data: {
                deviceFingerprint,
                temporaryName,
                initialMessage: initialMessage || null,
                detectedEmotion: initialEmotion || null,
                messageCount: 0,
                maxFreeMessages: 5,
                status: 'ACTIVE',
            },
        });

        // Generate JWT
        const token = (jwt.sign as any)(
            {
                sessionId: newSession.id,
                type: 'anonymous',
                deviceFingerprint: newSession.deviceFingerprint
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        logger.info(`New anonymous session created: ${newSession.id} for emotion: ${initialEmotion}`);

        return res.status(201).json({
            token,
            sessionId: newSession.id,
            temporaryName: newSession.temporaryName,
            messageCount: newSession.messageCount,
            maxFreeMessages: newSession.maxFreeMessages,
            isExisting: false
        });

    } catch (error: any) {
        logger.error('Error creating anonymous session:', error);

        // Database connection error
        if (error.code === 'P1001' || error.code === 'P1002') {
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Database connection failed. Please try again later.',
                retryAfter: 30
            });
        }

        // Unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A session with this device fingerprint already exists.'
            });
        }

        // Generic database error
        if (error.code && error.code.startsWith('P')) {
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'A database error occurred. Please contact support if this persists.'
            });
        }

        // Unknown error
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};

/**
 * GET /api/auth/session-status/:sessionId
 * Check the status of an anonymous session
 */
export const getSessionStatus = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'sessionId is required'
            });
        }

        const session = await prisma.anonymousSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Session not found'
            });
        }

        return res.status(200).json({
            sessionId: session.id,
            status: session.status,
            messageCount: session.messageCount,
            maxFreeMessages: session.maxFreeMessages,
            hasReachedLimit: session.messageCount >= session.maxFreeMessages,
            expiresAt: session.expiresAt,
            convertedUserId: session.convertedUserId
        });

    } catch (error: any) {
        logger.error('Error fetching session status:', error);

        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch session status'
        });
    }
};

