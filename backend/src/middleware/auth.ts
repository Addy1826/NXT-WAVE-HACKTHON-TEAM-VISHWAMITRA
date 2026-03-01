import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ error: 'Forbidden: No role assigned.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }

        next();
    };
};
