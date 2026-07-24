import { query } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, ward } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['customer', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const userCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role, ward, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, created_at`,
      [name, email, phone || null, password_hash, role, ward || null, role === 'admin']
    );

    const user = result.rows[0];

    // If role is provider, create a provider profile entry
    if (role === 'provider') {
      const categoryId = req.body.categoryId || 1;
      const hourlyRate = req.body.hourlyRate || 500;
      const bio = req.body.bio || '';
      const citizenshipNo = req.body.citizenshipNo || null;

      await query(
        `INSERT INTO provider_profiles (user_id, category_id, hourly_rate, availability, citizenship_no)
         VALUES ($1, $2, $3, true, $4)`,
        [user.id, categoryId, hourlyRate, citizenshipNo]
      );

      if (bio) {
        await query(
          `UPDATE users SET bio = $1, is_verified = false WHERE id = $2`,
          [bio, user.id]
        );
      }
    }

    const token = generateToken(user.id, role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user (case-insensitive email matching and trimmed input)
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const result = await query(
      'SELECT id, name, email, password_hash, role, is_verified FROM users WHERE LOWER(email) = LOWER($1) AND is_active = TRUE',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Update last login
    await query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.ward, u.avatar_url, u.bio, u.is_verified,
              pp.hourly_rate, pp.rating_avg, pp.availability
       FROM users u
       LEFT JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
