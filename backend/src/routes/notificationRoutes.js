import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyAuth, notificationController.getUserNotifications);
router.get('/unread/count', verifyAuth, notificationController.getUnreadCount);
router.patch('/:notificationId/read', verifyAuth, notificationController.markAsRead);
router.patch('/read-all', verifyAuth, notificationController.markAllAsRead);
router.delete('/:notificationId', verifyAuth, notificationController.deleteNotification);

export default router;
