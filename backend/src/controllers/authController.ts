import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Therapist from '../models/Therapist';

// In-memory storage for fallback
const localUsers: any[] = [];

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

            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

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

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
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

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
