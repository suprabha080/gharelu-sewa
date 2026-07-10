# 🎓 Viva & Presentation Preparation: Frequently Asked Questions

This document is designed to prepare you for questions your teacher, external examiner, or supervisor might ask during your project defense, presentation, or viva voce.

---

## ❓ General Architecture Questions

### Q1: What is the tech stack of your application, and why did you choose it?
* **Answer:** 
  * **Frontend:** React.js built with Vite, styled using Tailwind CSS. We chose React because of its component-based architecture which makes coding reusable parts (like Cards, Inputs, and Chat widgets) easier.
  * **Backend:** Node.js with Express framework. Express provides a fast, minimal, and unopinionated framework for building REST APIs.
  * **Real-time Engine:** Socket.io for instantaneous communication (chat messaging and live status updates).
  * **Database:** PostgreSQL. Since this is a transactional app handling payments and booking statuses, we needed a robust Relational Database Management System (RDBMS) that supports ACID properties.

### Q2: How does the communication between the Frontend and Backend happen?
* **Answer:** Communication happens in two ways:
  1. **REST APIs (HTTP Requests):** For standard, transactional operations (e.g. User authentication, booking creation, profile updates, and payment initiation). The frontend uses `axios` to execute GET, POST, PATCH, and DELETE requests.
  2. **WebSockets (TCP Connections):** For persistent, two-way, real-time actions where speed is critical (e.g. Chat messages between the customer and provider, and live tracking updates). This is handled by Socket.io.

---

## ❓ Authentication & Security Questions

### Q3: How do you secure user passwords in your database?
* **Answer:** We never store plain text passwords. We encrypt them using **BCrypt** with a salt factor of 10 (`bcryptjs` library). BCrypt uses a one-way hashing algorithm, meaning even if the database is compromised, the original passwords cannot be easily deciphered.

### Q4: Explain how your authentication token works. How does the frontend access protected routes?
* **Answer:** 
  * We use **JWT (JSON Web Tokens)** for stateless authentication.
  * When a user logs in successfully, the backend creates a token containing the user's ID and role, signed with a secret key.
  * The frontend saves this token in `localStorage`.
  * We use an **Axios Interceptor** on the frontend that automatically reads this token and appends it to the `Authorization` header (`Bearer <token>`) on every outgoing API request.
  * The backend's `verifyAuth` middleware decodes and verifies the token. If it matches, the request is allowed through.

### Q5: How do you enforce role-based access control (RBAC)?
* **Answer:** We have middleware functions (`verifyAuth` and `authorize`) on our backend routes. For example, to fetch the pending provider lists, the route is defined as:
  `router.get('/all', verifyAuth, authorize(['admin']), getAllPayments);`
  If the decoded JWT does not show the role is `admin`, the server immediately returns a `403 Forbidden` response.

---

## ❓ Database & Performance Questions

### Q6: Why did you choose PostgreSQL over MongoDB?
* **Answer:** Gharelu Sewa is a transactional platform. Booking lifecycles require strict schema validation, state consistency, and relational integrity.
  * If a payment is processed, it must update the booking table and trigger a notification. If one query fails, the entire transaction should roll back (ACID compliance).
  * MongoDB is document-oriented and great for unstructured data, but PostgreSQL guarantees structural rules via Foreign Keys and Constraints (like checking status inputs), making it much safer for apps involving billing and payments.

### Q7: What are database indexes, and where did you use them?
* **Answer:** Indexes are data structures (typically B-Trees in Postgres) that speed up the retrieval of rows by avoiding a full table scan. We added indexes on foreign keys and frequently searched fields:
  * `idx_users_email` (speed up login queries)
  * `idx_bookings_customer_id` and `idx_bookings_provider_id` (speed up loading dashboard booking lists)
  * `idx_messages_booking_id` (speed up retrieving chat history)

---

## ❓ Payment & Sockets Questions

### Q8: Explain your eSewa payment integration. How do you prevent fraud?
* **Answer:** 
  * When a customer clicks "Pay", the backend calculates the due amount and signs a query string using **HMAC-SHA256** with a secure merchant secret key.
  * This signature is sent to eSewa's gateway along with the invoice detail parameters.
  * When the customer completes the payment, eSewa redirects them back with verification queries (`oid`, `amt`, `refId`).
  * Instead of completing the transaction on the frontend, the frontend passes these parameters to our backend endpoint (`/api/payments/verify`). Our server checks the transaction against the database record, validates the signed parameters, and updates the payment status to `completed`.

### Q9: How does Socket.io implement Chat rooms? Why did you use rooms?
* **Answer:** When a user opens a Booking Details page, the client emits a `join_booking` event with the `bookingId`. The server processes this by calling `socket.join('booking_' + bookingId)`.
  * When a message is sent via `send_message`, the server broadcasts it only to that specific room (`socket.to('booking_' + bookingId).emit('receive_message')`).
  * Using rooms prevents broadcast leaks—meaning customers and providers can only see messages intended for their specific transaction.
