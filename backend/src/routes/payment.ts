import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/razorpay/order', authMiddleware, createOrder);
router.post('/razorpay/verify', authMiddleware, verifyPayment);

export default router;
