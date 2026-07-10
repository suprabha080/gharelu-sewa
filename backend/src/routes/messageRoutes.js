import express from 'express';
import * as messageController from '../controllers/messageController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyAuth, messageController.sendMessage);
router.get('/booking/:bookingId', verifyAuth, messageController.getBookingMessages);
router.get('/booking/:bookingId/count', verifyAuth, messageController.getMessageCount);

export default router;
