import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController';
import { authMiddleware, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.post('/razorpay/order', authMiddleware, authorizeRoles('PATIENT'), createOrder);
router.post('/razorpay/verify', authMiddleware, authorizeRoles('PATIENT'), verifyPayment);

export default router;
