import { query } from '../config/database.js';

// Create booking (Customer)
export const createBooking = async (req, res) => {
  try {
    const { provider_id, category_id, booking_date, location, description, is_emergency } = req.body;

    if (!provider_id || !category_id || !booking_date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO bookings (customer_id, provider_id, category_id, booking_date, location, description, is_emergency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, customer_id, provider_id, status, booking_date, location, is_emergency, created_at`,
      [req.userId, provider_id, category_id, booking_date, location, description || null, is_emergency || false]
    );

    const booking = result.rows[0];

    // Create notification for provider
    await query(
      `INSERT INTO notifications (user_id, booking_id, message, type)
       VALUES ($1, $2, $3, $4)`,
      [provider_id, booking.id, `New booking request from customer`, 'booking_request']
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get all bookings for user
export const getUserBookings = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT b.id, b.customer_id, b.provider_id, b.status, b.booking_date, b.location, b.is_emergency,
             cu.name as customer_name, cu.phone as customer_phone, cu.avatar_url as customer_avatar,
             p.name as provider_name, p.phone as provider_phone, p.avatar_url as provider_avatar,
             sc.name as service_category, b.created_at, b.updated_at
      FROM bookings b
      JOIN users cu ON b.customer_id = cu.id
      JOIN users p ON b.provider_id = p.id
      JOIN service_categories sc ON b.category_id = sc.id
      WHERE (b.customer_id = $1 OR b.provider_id = $1)
    `;

    const params = [req.userId];

    if (status) {
      sql += ` AND b.status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ` ORDER BY b.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await query(
      `SELECT b.id, b.customer_id, b.provider_id, b.status, b.booking_date, b.location, b.description, b.is_emergency,
              cu.name as customer_name, cu.phone as customer_phone, cu.avatar_url as customer_avatar, cu.ward as customer_ward,
              p.name as provider_name, p.phone as provider_phone, p.avatar_url as provider_avatar, p.ward as provider_ward,
              sc.name as service_category, pp.hourly_rate, b.created_at, b.updated_at
       FROM bookings b
       JOIN users cu ON b.customer_id = cu.id
       JOIN users p ON b.provider_id = p.id
       JOIN service_categories sc ON b.category_id = sc.id
       LEFT JOIN provider_profiles pp ON p.id = pp.user_id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is part of this booking
    const booking = result.rows[0];
    if (booking.customer_id !== req.userId && booking.provider_id !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Update booking status (Provider or Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, message } = req.body;

    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get booking first
    const bookingResult = await query('SELECT customer_id, provider_id, status FROM bookings WHERE id = $1', [bookingId]);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check authorization - only provider or admin can update
    if (req.role !== 'admin' && req.userId !== booking.provider_id) {
      return res.status(403).json({ error: 'Only provider or admin can update booking' });
    }

    // Update booking
    const result = await query(
      `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, bookingId]
    );

    // Notify customer
    await query(
      `INSERT INTO notifications (user_id, booking_id, message, type)
       VALUES ($1, $2, $3, $4)`,
      [booking.customer_id, bookingId, `Booking status changed to ${status}`, 'status_update']
    );

    res.json({
      message: 'Booking status updated',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingResult = await query('SELECT customer_id, provider_id FROM bookings WHERE id = $1', [bookingId]);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check if user is part of booking
    if (req.userId !== booking.customer_id && req.userId !== booking.provider_id && req.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(
      `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    // Notify other party
    const otherUserId = req.userId === booking.customer_id ? booking.provider_id : booking.customer_id;
    await query(
      `INSERT INTO notifications (user_id, booking_id, message, type)
       VALUES ($1, $2, $3, $4)`,
      [otherUserId, bookingId, 'Booking has been cancelled', 'booking_cancelled']
    );

    res.json({
      message: 'Booking cancelled',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Create emergency booking (broadcasts to all available providers in ward)
export const createEmergencyBooking = async (req, res) => {
  try {
    const { category_id, location, description, ward } = req.body;

    if (!category_id || !location || !ward) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get all available providers in the ward
    const providersResult = await query(
      `SELECT u.id FROM users u
       JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE u.ward = $1 AND pp.category_id = $2 AND u.is_verified = TRUE AND pp.availability = TRUE`,
      [ward, category_id]
    );

    if (providersResult.rows.length === 0) {
      return res.status(404).json({ error: 'No available providers in this ward' });
    }

    // Get the first available provider (for simplicity in MVP)
    const providerId = providersResult.rows[0].id;

    const result = await query(
      `INSERT INTO bookings (customer_id, provider_id, category_id, booking_date, location, description, is_emergency)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, true)
       RETURNING id, customer_id, provider_id, status, created_at`,
      [req.userId, providerId, category_id, location, description || null]
    );

    const booking = result.rows[0];

    // Notify all available providers
    for (const provider of providersResult.rows) {
      await query(
        `INSERT INTO notifications (user_id, booking_id, message, type)
         VALUES ($1, $2, $3, $4)`,
        [provider.id, booking.id, `URGENT: Emergency service request in ${ward}`, 'emergency_request']
      );
    }

    res.status(201).json({
      message: 'Emergency booking created and providers notified',
      booking,
      notified_providers: providersResult.rows.length,
    });
  } catch (error) {
    console.error('Create emergency booking error:', error);
    res.status(500).json({ error: 'Failed to create emergency booking' });
  }
};
