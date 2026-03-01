"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionStatus = exports.createAnonymousSession = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Therapist_1 = __importDefault(require("../models/Therapist"));
const AnonymousSession_1 = __importDefault(require("../models/AnonymousSession"));
const logger_1 = __importDefault(require("../utils/logger"));
// JWT Configuration
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
if (!process.env.JWT_SECRET) {
    logger_1.default.error('CRITICAL: JWT_SECRET is missing in authController');
}
const JWT_SECRET = process.env.JWT_SECRET;
// Enum mapping match Prisma schema
var UserRole;
(function (UserRole) {
    UserRole["PATIENT"] = "PATIENT";
    UserRole["THERAPIST"] = "THERAPIST";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const register = async (req, res) => {
    try {
        const { name, email, password, role, specialization, bio, experienceYears, hourlyRate } = req.body;
        // Validation
        const normalizedRole = role && role.toUpperCase() === 'THERAPIST' ? UserRole.THERAPIST : UserRole.PATIENT;
        // Check existing user
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            passwordHash,
            role: normalizedRole,
            accountStatus: 'ACTIVE'
        });
        if (normalizedRole === UserRole.THERAPIST) {
            await Therapist_1.default.create({
                userId: user._id,
                licenseNumber: `TEMP_${Date.now()}`, // TODO: Add license field to frontend registration
                licenseState: 'NA',
                licenseExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                specializations: specialization || [],
                bio: bio || '',
                experienceYears: experienceYears ? parseInt(experienceYears) : 0,
                hourlyRateUSD: hourlyRate ? parseFloat(hourlyRate) : 0.0,
                hourlyRateINR: hourlyRate ? parseFloat(hourlyRate) * 83 : 0.0, // Rough conversion fallback
                verificationStatus: 'PENDING'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Map response to match expected frontend structure (generic User object)
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.toLowerCase() // Frontend expects lowercase
            }
        });
    }
    catch (error) {
        logger_1.default.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !user.passwordHash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.toLowerCase()
            }
        });
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
// ============================================================================
// ANONYMOUS SESSION MANAGEMENT 
// ============================================================================
/**
 * POST /api/auth/anonymous
 * Create an anonymous session for progressive profiling
 */
const createAnonymousSession = async (req, res) => {
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
        let existingSession = await AnonymousSession_1.default.findOne({ deviceFingerprint });
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
            const token = jsonwebtoken_1.default.sign({
                sessionId: existingSession._id,
                type: 'anonymous',
                deviceFingerprint: existingSession.deviceFingerprint
            }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            logger_1.default.info(`Existing anonymous session retrieved: ${existingSession._id}`);
            return res.status(200).json({
                token,
                sessionId: existingSession._id,
                messageCount: existingSession.messageCount,
                maxFreeMessages: existingSession.maxFreeMessages,
                isExisting: true
            });
        }
        // Create new anonymous session
        const temporaryName = `Guest_${Math.random().toString(36).substring(2, 8)}`;
        const newSession = await AnonymousSession_1.default.create({
            deviceFingerprint,
            temporaryName,
            initialMessage: initialMessage || null,
            detectedEmotion: initialEmotion || null,
            messageCount: 0,
            maxFreeMessages: 5,
            status: 'ACTIVE',
        });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({
            sessionId: newSession._id,
            type: 'anonymous',
            deviceFingerprint: newSession.deviceFingerprint
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        logger_1.default.info(`New anonymous session created: ${newSession._id} for emotion: ${initialEmotion}`);
        return res.status(201).json({
            token,
            sessionId: newSession._id,
            temporaryName: newSession.temporaryName,
            messageCount: newSession.messageCount,
            maxFreeMessages: newSession.maxFreeMessages,
            isExisting: false
        });
    }
    catch (error) {
        logger_1.default.error('Error creating anonymous session:', error);
        // Unique constraint violation (Mongoose)
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A session with this device fingerprint already exists.'
            });
        }
        // Unknown error
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};
exports.createAnonymousSession = createAnonymousSession;
/**
 * GET /api/auth/session-status/:sessionId
 * Check the status of an anonymous session
 */
const getSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'sessionId is required'
            });
        }
        const session = await AnonymousSession_1.default.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Session not found'
            });
        }
        return res.status(200).json({
            sessionId: session._id,
            status: session.status,
            messageCount: session.messageCount,
            maxFreeMessages: session.maxFreeMessages,
            hasReachedLimit: session.messageCount >= session.maxFreeMessages,
            expiresAt: session.expiresAt,
            convertedUserId: session.convertedUserId
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching session status:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch session status'
        });
    }
};
exports.getSessionStatus = getSessionStatus;
//# sourceMappingURL=authController.js.map