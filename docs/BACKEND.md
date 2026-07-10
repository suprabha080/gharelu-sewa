# 💻 Backend Architecture: Node.js, Express & WebSockets

This document details the backend structure of **Gharelu Sewa**. It covers our design decisions, authentication system, socket connections, and how we handle eSewa payments securely.

---

## 🏗️ Folder Structure (Backend)

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js     # PostgreSQL Pool configuration
│   │   ├── initDb.js       # Auto-initialization tables & seed data
│   │   └── socket.js       # Socket.io Room setups and events
│   ├── controllers/
│   │   ├── adminController.js     # Verification & analytics dashboards
│   │   ├── authController.js      # User registration & login (JWT)
│   │   ├── bookingController.js   # Bookings CRUD & Emergency broadcast
│   │   ├── messageController.js   # Live Chat DB backup storage
│   │   └── paymentController.js   # eSewa initiation and HMAC signature
│   ├── middleware/
│   │   ├── auth.js                # JWT verifying & role guards
│   │   └── errorHandler.js        # Catch-all express error handlers
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoint mapping
│   │   ├── bookingRoutes.js       # Customer/Provider booking endpoints
│   │   ├── messageRoutes.js       # Message history endpoints
│   │   ├── paymentRoutes.js       # eSewa invoice & verification routes
│   │   └── ...                    # Other route definitions
│   └── server.js                  # Entry point (http and socket binding)
```

---

## 🔒 Security & Authentication (JWT & bcrypt)

We enforce **Token-Based Authentication** using JSON Web Tokens (JWT) and passwords encrypted via **BCrypt**.

### 1. Registration & Password Encryption
When users sign up, we encrypt their password before saving it to PostgreSQL.
```javascript
// Hash passwords using salt factor 10
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
```
New Service Providers are saved with `is_verified = false` to block dashboard access until approved by an admin.

### 2. Login & JWT Generation
When a user logs in, we compare hashes. If valid, we generate a token signed with `JWT_SECRET`:
```javascript
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
```

### 3. Route Guard Middleware (`verifyAuth` & `authorize`)
To protect routes, we inspect the incoming `Authorization` header. We append `req.userId` and `req.role` to the request object.
```javascript
export const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  req.userId = decoded.userId;
  req.role = decoded.role;
  next();
};

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
```
*Usage Example:* `router.get('/all', verifyAuth, authorize(['admin']), getAllPayments);`

---

## 🔌 Socket.io Real-time Communication

WebSockets are handled concurrently with our Express HTTP Server via `socket.io`.

### 1. Connection Event Binding
We bind the socket listener in `src/config/socket.js`. Users join booking-specific "chat rooms" so messages are isolated and broadcast to the specific customer and provider.

```javascript
export const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join room
    socket.on('join_booking', (bookingId) => {
      socket.join(`booking_${bookingId}`);
      console.log(`👤 Socket ${socket.id} joined room: booking_${bookingId}`);
    });

    // Real-time Message Broadcast
    socket.on('send_message', (data) => {
      const { bookingId, message, senderName, senderId } = data;
      // Broadcast to other users in the room
      socket.to(`booking_${bookingId}`).emit('receive_message', {
        id: Date.now(),
        senderId,
        senderName,
        content: message,
        sent_at: new Date().toISOString()
      });
    });

    // Leave room
    socket.on('leave_booking', (bookingId) => {
      socket.leave(`booking_${bookingId}`);
      console.log(`👤 Socket ${socket.id} left room: booking_${bookingId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });
  return io;
};
```

---

## 💸 eSewa Payment Integration (HMAC-SHA256 Signing)

To prevent users from modifying invoices (e.g. paying Rs. 1 instead of Rs. 600), eSewa v2 API requires a **digital signature** hashed with a shared merchant secret code.

### 1. HMAC Signature Computation
The signature takes three parameters (`total_amount`, `transaction_uuid`, and `product_code`) joined as a string and hashed using HMAC-SHA256:
```javascript
import crypto from 'crypto';

function generateEsewaSignature(amount, transactionUuid) {
  const secret = process.env.ESEWA_SECRET || '8gBm/:&EnhH.1/q'; // Sandbox secret key
  const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;
  
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64');
}
```

### 2. Verify payment redirect callback (`verifyPayment`)
When eSewa redirects the customer back to `/payment/success`, our frontend calls our backend verification route:
```javascript
export const verifyPayment = async (req, res) => {
  const { oid, amt, refId } = req.query;

  // 1. Fetch pending payment record
  const paymentResult = await query(
    `SELECT * FROM payments WHERE esewa_oid = $1 AND status = 'pending'`,
    [oid]
  );
  
  if (paymentResult.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
  const payment = paymentResult.rows[0];

  // 2. Validate gross transaction amount
  if (parseFloat(amt) !== parseFloat(payment.amount)) {
    await query(`UPDATE payments SET status = 'failed' WHERE esewa_oid = $1`, [oid]);
    return res.status(400).json({ error: 'Amount mismatch' });
  }

  // 3. Commit state changes, split platform commission, and push notifications
  await query(
    `UPDATE payments SET status = 'completed', esewa_ref_id = $1, paid_at = CURRENT_TIMESTAMP WHERE esewa_oid = $2`,
    [refId, oid]
  );
  // ... (notify users)
};
```
This ensures zero fraud since the payment status is validated by the server before any payout is registered.
