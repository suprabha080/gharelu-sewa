# 🎨 Frontend Architecture: React, Tailwind CSS & State Management

This document details the frontend architecture of **Gharelu Sewa**. It covers key modules, page templates, routing configurations, and how our interactive views communicate with our API.

---

## 🏗️ Folder Structure (Frontend)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Button.jsx          # Reusable customized buttons
│   │   ├── Card.jsx            # Premium borders, backgrounds, and drop shadows
│   │   ├── Chat.jsx            # Real-time WebSocket Messaging panel
│   │   ├── Header.jsx          # Role switcher navigation header
│   │   └── Input.jsx           # Tailwind style inputs
│   ├── context/
│   │   └── AuthContext.jsx     # Handles authentication token storage & state
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── BookingDetails.jsx  # Job details & Live chat customer portal
│   │   │   ├── BookingWizard.jsx   # Dynamic 4-Step calendar booking form
│   │   │   ├── BrowseServices.jsx  # Service provider browsing search/filters
│   │   │   ├── Dashboard.jsx       # Customer control panel
│   │   │   ├── InvoicePage.jsx     # eSewa secure checkout portal
│   │   │   └── PaymentSuccess.jsx  # eSewa callback verification handler
│   │   ├── provider/
│   │   │   ├── Dashboard.jsx       # Premium provider dashboard interface
│   │   │   ├── MyBookings.jsx      # Provider active jobs list view
│   │   │   └── Profile.jsx         # Profile and availability manager
│   │   ├── admin/
│   │   │   ├── ManageProviders.jsx # KYC verify and approval dashboard
│   │   │   └── ...                 # Admin dashboards
│   │   └── HomePage.jsx            # Landing page
│   ├── services/
│   │   ├── api.js              # Axios setup with JWT request interceptors
│   │   └── socket.js           # Socket.io Client initialization wrapper
│   ├── App.jsx                 # Route manager definitions
│   └── main.jsx                # DOM root mount
```

---

## 🔐 Session Management: AuthContext

State is distributed to components globally using React's **Context API**. This manages login states, tokens, and active user profile objects.

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Axios Interceptors automatically read token from localStorage and append it 
  // to the request headers (Authorization: Bearer <token>) on every API request.
  
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🧭 Page Routers & Protected Guards (`App.jsx`)

We structure routes based on user authorization privileges using react-router-dom:

```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;
  return children;
};
```
- **Customer Portal**: Nested under `/customer/*` protected routes. Includes the service directory browser, details card, and eSewa checkout pages.
- **Provider Portal**: Protected under `/provider/*` routes. Restricts entry until accounts pass admin KYC checks (`user.is_verified === true`).

---

## 📅 Dynamic 4-Step Booking Wizard (`BookingWizard.jsx`)

The booking workflow is divided into 4 sequential steps to improve UX completion rates:

1. **Step 1: Service Detail & Photo attachment** — Dynamically lists services depending on the category selected from the landing page. Customers can write notes or attach a description photo.
2. **Step 2: Date & Time Picker** — Upgraded from basic text inputs to a responsive HTML `datetime-local` input, pre-defaulted to tomorrow morning.
3. **Step 3: Pokhara Ward Dropdown** — Grouped select field prioritizing Pokhara locations (*Lakeside*, *Bagar*, *Chipiyata*) for clean geo-targeting.
4. **Step 4: Invoice Summary & Confirmation** — Displays items, scheduled times, locations, and pricing before initiating the backend request.

---

## 💬 Live Chat Panel (`Chat.jsx`)

Uses WebSockets to sync messages instantly. It integrates an **Optimistic UI pattern**:

```javascript
const handleSend = async (e) => {
  e.preventDefault();
  const messageText = newMessage;
  
  // 1. Optimistic Update (Immediate message render)
  setMessages(prev => [...prev, {
    id: `local-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    content: messageText,
    timestamp: new Date().toISOString()
  }]);

  // 2. Save message to PostgreSQL database via API
  await messageAPI.sendMessage({ booking_id: bookingId, content: messageText });

  // 3. Emit event to Socket.io to sync with the receiver
  const socket = getSocket();
  if (socket) {
    socket.emit('send_message', { bookingId, message: messageText, senderName: user.name, senderId: user.id });
  }
};
```
This guarantees that conversations feel smooth and instant, even on slower networks.
