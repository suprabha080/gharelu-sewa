// Shared Socket.IO instance holder
// This allows controllers to emit real-time events without circular imports

let _io = null;

export const setIO = (io) => {
  _io = io;
};

export const getIO = () => _io;

// ── Helper: send notification to a user (DB + Socket) ──
import { query } from './database.js';

export const sendNotification = async (userId, bookingId, message, type) => {
  // 1. Save to DB
  try {
    await query(
      `INSERT INTO notifications (user_id, booking_id, message, type) VALUES ($1, $2, $3, $4)`,
      [userId, bookingId, message, type]
    );
  } catch (err) {
    console.error('Failed to save notification to DB:', err.message);
  }

  // 2. Push via Socket.IO (real-time)
  if (_io) {
    _io.to(`user_${userId}`).emit('notification', {
      type,
      message,
      bookingId,
      created_at: new Date().toISOString(),
    });
  }
};

// ── Helper: notify ALL admins ──
export const notifyAllAdmins = async (bookingId, message, type) => {
  try {
    const admins = await query(`SELECT id FROM users WHERE role = 'admin'`);
    for (const admin of admins.rows) {
      await sendNotification(admin.id, bookingId, message, type);
    }
  } catch (err) {
    console.error('Failed to notify admins:', err.message);
  }
};
