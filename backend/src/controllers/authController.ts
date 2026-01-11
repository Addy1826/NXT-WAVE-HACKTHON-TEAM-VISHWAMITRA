import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import prisma from '../config/prisma';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

// JWT Configuration
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

if (!process.env.JWT_SECRET) {
    logger.error('CRITICAL: JWT_SECRET is missing in authController');
}
const JWT_SECRET: string = process.env.JWT_SECRET as string;

// Enum mapping match Prisma schema
enum UserRole {
    PATIENT = 'PATIENT',
    THERAPIST = 'THERAPIST',
    ADMIN = 'ADMIN'
}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, specialization, bio, experienceYears, hourlyRate } = req.body;

        // Validation
        const normalizedRole = role && role.toUpperCase() === 'THERAPIST' ? UserRole.THERAPIST : UserRole.PATIENT;

        // Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Transaction to ensure atomicity of User + Therapist profile creation
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: normalizedRole,
                    accountStatus: 'ACTIVE'
                }
            });

            if (normalizedRole === UserRole.THERAPIST) {
                await tx.therapist.create({
                    data: {
                        userId: user.id,
                        licenseNumber: `TEMP_${Date.now()}`, // TODO: Add license field to frontend registration
                        licenseState: 'NA',
                        licenseExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        specializations: specialization || [],
                        bio: bio || '',
                        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
                        hourlyRateUSD: hourlyRate ? parseFloat(hourlyRate) : 0.0,
                        hourlyRateINR: hourlyRate ? parseFloat(hourlyRate) * 83 : 0.0, // Rough conversion fallback
                        verificationStatus: 'PENDING'
                    }
                });
            }

            return user;
        });

        const token = jwt.sign(
            { id: result.id, role: result.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        // Map response to match expected frontend structure (generic User object)
        res.status(201).json({
            token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role.toLowerCase() // Frontend expects lowercase
            }
        });

    } catch (error: any) {
        logger.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.toLowerCase()
            }
        });
    } catch (error: any) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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

