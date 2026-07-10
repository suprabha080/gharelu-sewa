# 🔄 System Interaction & Payment Flows

This document details the architectural interactions and sequence diagrams for the booking process, real-time messaging, and eSewa payments.

---

## 1. End-to-End Booking Lifecycle

The following sequence diagram outlines how a customer schedules a booking, a provider updates the job status, and how the platform handles state updates.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (Priya)
    actor Provider as 🛠️ Provider (Rajesh)
    participant Client as 🖥️ React Frontend
    participant Server as ⚙️ Express Backend
    participant DB as 🗄️ PostgreSQL Database

    Customer->>Client: Fills booking wizard (Step 1-4)
    Client->>Server: POST /api/bookings {provider_id, booking_date, location, description}
    Server->>DB: INSERT INTO bookings (status='pending')
    DB-->>Server: Retuns booking ID
    Server->>DB: INSERT INTO notifications (type='booking_request')
    Server-->>Client: 201 Created {booking}
    Client->>Customer: Redirect to BookingDetails page

    Note over Client, Server: Real-time Socket events link chat room
    Client->>Server: join_booking {booking_id}

    Provider->>Client: Logs in & views My Bookings
    Provider->>Client: Clicks "Accept Job"
    Client->>Server: PATCH /api/bookings/:bookingId/status {status: 'accepted'}
    Server->>DB: UPDATE bookings SET status='accepted'
    Server->>DB: INSERT INTO notifications (type='status_update')
    Server-->>Client: 200 Success
    Client->>Provider: Refresh screen

    Provider->>Client: Clicks "Start Job"
    Client->>Server: status -> 'in_progress'
    Server->>DB: UPDATE status='in_progress'

    Provider->>Client: Clicks "Mark as Complete"
    Client->>Server: status -> 'completed'
    Server->>DB: UPDATE status='completed'
    Server-->>Client: Updated status
    Note over Customer, Provider: Customer now prompted to pay invoice
```

---

## 2. eSewa Payment & Signature Verification Loop

The diagram below details the sequence of transactions required to securely authenticate payments with eSewa v2 ePay API without risk of client-side payload tampering.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (Priya)
    participant Client as 🖥️ React Frontend
    participant Server as ⚙️ Express Backend
    participant DB as 🗄️ PostgreSQL Database
    participant eSewa as 💸 eSewa ePay Gateway

    Customer->>Client: Clicks "Pay Invoice"
    Client->>Server: POST /api/payments/initiate/:bookingId
    Note over Server: Calculates total price,<br/>computes 10% commission split,<br/>generates unique Order ID
    Server->>Server: HMAC-SHA256 Sign (amount, orderID, merchantCode)
    Server->>DB: INSERT INTO payments (status='pending')
    Server-->>Client: 200 Success {esewa_form_payload}
    
    Client->>Client: Mounts hidden form inputs
    Client->>eSewa: POST redirection to eSewa Checkout Gateway
    eSewa->>Customer: Displays login & OTP code screen
    Customer->>eSewa: Enters credentials & confirms
    eSewa-->>Client: Redirect to /payment/success?oid=GS-XX&amt=YY&refId=ZZ

    Client->>Server: GET /api/payments/verify?oid=GS-XX&amt=YY&refId=ZZ
    Server->>DB: SELECT payment WHERE esewa_oid = oid AND status='pending'
    alt Verification Matches
        Server->>DB: UPDATE payments SET status='completed', ref_id=refId
        Server->>DB: Create alerts for Customer & Provider
        Server-->>Client: 200 Verified
        Client->>Customer: Display "Payment Successful" receipt (splits shown)
    else Invalid Verification (Hack Attempt / Mismatch)
        Server->>DB: UPDATE payments SET status='failed'
        Server-->>Client: 400 Refused
        Client->>Customer: Display "Payment Verification Failed" screen
    end
```
---

## 3. Real-time Live Chat Synchronisation

How messages are stored to database and synchronized between client devices simultaneously.

```mermaid
sequenceDiagram
    autonumber
    actor UserA as 👤 Customer
    actor UserB as 🛠️ Provider
    participant ClientA as 🖥️ React Client A
    participant ClientB as 🖥️ React Client B
    participant Server as ⚙️ Socket.io Backend
    participant DB as 🗄️ PostgreSQL Database

    UserA->>ClientA: Types & sends message
    ClientA->>ClientA: Render instantly (Optimistic UI)
    ClientA->>Server: Socket.emit: send_message {bookingId, message, senderId}
    ClientA->>Server: POST /api/messages (Save request)
    Server->>DB: INSERT INTO messages
    Server->>ClientB: Socket.to(room).emit: receive_message {content}
    ClientB->>UserB: Plays chime & updates conversation list
```
Link this documentation files in the project README.md for future developers.
