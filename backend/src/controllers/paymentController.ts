import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import Payment from '../models/Payment';

// Initialize Razorpay with dummy keys if env vars are missing
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'INR', appointmentId } = req.body;
        const userId = (req as any).user?.id;

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt: appointmentId || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Link the order ID to the pending payment if appointmentId is known
        if (appointmentId && userId) {
            await Payment.updateMany(
                {
                    appointmentId,
                    userId,
                    status: 'PENDING'
                },
                {
                    $set: { razorpayOrderId: order.id }
                }
            );
        }

        res.json(order);
    } catch (error: any) {
        logger.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment successful, save directly to database
            const result = await Payment.updateMany(
                { razorpayOrderId: razorpay_order_id },
                {
                    $set: {
                        razorpayPaymentId: razorpay_payment_id,
                        status: 'COMPLETED',
                        paidAt: new Date()
                    }
                }
            );
            res.json({ success: true, message: 'Payment verified successfully', updatedCount: result.modifiedCount });
        } else {
            // Mark payment as failed if it's invalid
            await Payment.updateMany(
                { razorpayOrderId: razorpay_order_id },
                { $set: { status: 'FAILED' } }
            );
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error: any) {
        logger.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
};
