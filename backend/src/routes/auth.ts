import express from 'express';
import {
    register,
    login,
    createAnonymousSession,
    getSessionStatus
} from '../controllers/authController';

const router = express.Router();

// Traditional auth
router.post('/register', register);
router.post('/login', login);

// Anonymous session management
router.post('/anonymous', createAnonymousSession);
router.get('/session-status/:sessionId', getSessionStatus);

export default router;

