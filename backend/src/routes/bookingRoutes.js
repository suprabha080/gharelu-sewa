import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { verifyAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyAuth, authorize(['customer']), bookingController.createBooking);
router.get('/', verifyAuth, bookingController.getUserBookings);
router.get('/:bookingId', verifyAuth, bookingController.getBookingById);
router.patch('/:bookingId/status', verifyAuth, authorize(['provider', 'admin']), bookingController.updateBookingStatus);
router.patch('/:bookingId/cancel', verifyAuth, bookingController.cancelBooking);

// Emergency booking
router.post('/emergency/create', verifyAuth, authorize(['customer']), bookingController.createEmergencyBooking);

export default router;
