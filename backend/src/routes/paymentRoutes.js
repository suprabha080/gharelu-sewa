import express from 'express';
import { verifyAuth, authorize } from '../middleware/auth.js';
import {
  initiatePayment,
  verifyPayment,
  getPaymentByBooking,
  getAllPayments,
} from '../controllers/paymentController.js';

const router = express.Router();

// Initiate eSewa payment for a completed booking
router.post('/initiate/:bookingId', verifyAuth, initiatePayment);

// Verify eSewa callback (called from frontend after eSewa redirects back)
router.get('/verify', verifyAuth, verifyPayment);

// Get payment status for a booking
router.get('/booking/:bookingId', verifyAuth, getPaymentByBooking);

// Admin: get all payments
router.get('/all', verifyAuth, authorize(['admin']), getAllPayments);

export default router;
