import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { verifyAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(verifyAuth, authorize(['admin']));

router.get('/stats', adminController.getPlatformStats);
router.get('/providers/pending', adminController.getPendingProviders);
router.patch('/providers/:userId/verify', adminController.verifyProvider);
router.patch('/providers/:userId/reject', adminController.rejectProvider);
router.get('/bookings', adminController.getAllBookings);
router.get('/analytics', adminController.getAnalytics);
router.patch('/users/:userId/deactivate', adminController.deactivateUser);

export default router;
