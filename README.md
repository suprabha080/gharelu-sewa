# Gharelu Sewa - Local Service Platform

🏠 **Connecting you with trusted local service providers**

A full-stack web application for booking household services like electrical work, plumbing, tutoring, cleaning, and repairs. Built with modern web technologies for scalability, security, and user experience.

## 📋 Quick Start

### Prerequisites
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **PostgreSQL** (v12+)

### Installation

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Initialize database
npm run dev
```

**Environment Variables (.env):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gharelu_sewa
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=5000
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:5173
```

The server will automatically create all tables on first run.

#### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

**Environment Variables (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🏗️ Architecture

```
Gharelu Sewa/
├── Backend/
│   ├── src/
│   │   ├── config/         # Database & Socket configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, error handling
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # API client service
│   │   ├── utils/          # JWT, password utilities
│   │   └── server.js       # Express app entry
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API & Socket clients
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🔑 Demo Credentials

### Customer
- **Email**: customer@test.com
- **Password**: password123

### Service Provider
- **Email**: provider@test.com
- **Password**: password123

### Administrator
- **Email**: admin@test.com
- **Password**: password123

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
GET    /api/auth/me            - Get current user
```

### Users
```
PATCH  /api/users/profile      - Update profile
GET    /api/users/providers    - Browse service providers
GET    /api/users/providers/:id - Get provider details
```

### Services
```
GET    /api/categories         - All service categories
GET    /api/categories/:id/providers - Providers in category
```

### Bookings
```
POST   /api/bookings           - Create booking
GET    /api/bookings           - User's bookings
GET    /api/bookings/:id       - Booking details
PATCH  /api/bookings/:id/status - Update status
POST   /api/bookings/emergency/create - Emergency booking
```

### Reviews
```
POST   /api/reviews            - Create review
GET    /api/reviews/provider/:id - Provider reviews
GET    /api/reviews/stats/:id  - Provider statistics
```

### Messages
```
POST   /api/messages           - Send message
GET    /api/messages/booking/:id - Booking messages
```

### Notifications
```
GET    /api/notifications      - User notifications
PATCH  /api/notifications/:id/read - Mark read
PATCH  /api/notifications/read-all - Mark all read
```

### Admin
```
GET    /api/admin/stats        - Platform statistics
GET    /api/admin/providers/pending - Pending providers
PATCH  /api/admin/providers/:id/verify - Verify provider
GET    /api/admin/analytics    - Analytics data
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Token-based secure authentication
- ✅ **Password Hashing** - bcrypt with salt rounds for security
- ✅ **Role-Based Access Control** - Customer, Provider, Admin roles
- ✅ **CORS Protection** - Cross-origin resource sharing
- ✅ **Input Validation** - Server-side request validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Database Constraints** - Foreign keys and data integrity

## 🚀 Features Implemented

### For Customers
- ✅ User registration & authentication
- ✅ Browse service providers by category
- ✅ Filter providers by ward/location and rating
- ✅ Create booking requests
- ✅ Track booking status in real-time
- ✅ In-booking chat with provider
- ✅ Rate and review completed services
- ✅ View booking history

### For Service Providers
- ✅ Provider registration & profile setup
- ✅ Manage service category and hourly rate
- ✅ Toggle availability on/offline
- ✅ View and manage bookings
- ✅ Accept or decline requests
- ✅ In-booking communication
- ✅ View earnings and statistics
- ✅ Track rating and reviews

### For Administrators
- ✅ Verify new provider accounts
- ✅ Manage service categories
- ✅ Monitor platform statistics
- ✅ View all bookings and transactions
- ✅ Access analytics dashboard
- ✅ User and provider management

### Real-Time Features
- ✅ **Socket.IO Integration** - Instant notifications
- ✅ **Booking Status Updates** - Real-time state changes
- ✅ **Live Messaging** - In-booking chat system
- ✅ **Availability Indicators** - Provider online/offline status
- ✅ **Notification Center** - Unread count and alerts

## 📦 Database Schema

### Tables
- **users** - All user accounts (customers, providers, admins)
- **service_categories** - Available service types
- **provider_profiles** - Extended provider information
- **bookings** - Service booking requests
- **reviews** - Customer reviews and ratings
- **messages** - In-booking chat messages
- **notifications** - User notifications log

## 🔄 Development Workflow

### Backend Development
```bash
cd backend
npm run dev         # Start with nodemon
npm start          # Production start
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📱 Responsive Design

- ✅ Mobile-first design
- ✅ Tablet optimized
- ✅ Desktop enhanced
- ✅ Touch-friendly UI
- ✅ Accessible navigation

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub and connect to Vercel
```

### Backend (Render)
```bash
# Create Render account and connect GitHub repo
# Set environment variables in Render dashboard
# Deploy!
```

### Database (Supabase/Render)
```bash
# Use managed PostgreSQL from Supabase or Render
# Update DB_HOST, DB_USER, DB_PASSWORD in .env
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -i :5000           # Backend
lsof -i :5173           # Frontend

# Windows
netstat -ano | findstr :5000
```

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists: `createdb gharelu_sewa`

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check Socket.IO CORS configuration

### Hot Reload Not Working
- Restart dev server
- Check file watcher limits (Linux)

## 📖 Documentation

- [Database Architecture](./docs/DATABASE.md) - ER diagrams, columns, constraints and indexes
- [Backend Systems](./docs/BACKEND.md) - Server setup, auth tokens, sockets, and eSewa signatures
- [Frontend Portal](./docs/FRONTEND.md) - React routing, Auth contexts, wizards, and premium dashboard
- [System Interaction Flow](./docs/SYSTEM_FLOW.md) - Mermaids mapping booking lifecycles & transactions
- [Viva/Defense Preparation](./docs/VIVA_QUESTIONS.md) - Examiner/viva questions & detailed answers
- [API Documentation](./API_DOCS.md) - Detailed endpoint docs
- [Database Schema](./SCHEMA.md) - ER diagram and tables
- [Deployment Guide](./DEPLOYMENT.md) - Production setup

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📝 License

MIT License - feel free to use this project

## 💬 Support

For issues or questions:
1. Check troubleshooting section
2. Open an issue on GitHub
3. Contact development team

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [x] Payment gateway integration (eSewa, Khalti)
- [ ] GPS-based provider mapping
- [ ] AI-powered recommendations
- [ ] Multi-language support (Nepali)
- [x] Provider background verification
- [ ] Premium subscription plans
- [ ] Advanced analytics

---

**Made with ❤️ by Gharelu Sewa Team**

Tribhuvan University | Institute of Engineering | Paschimanchal Campus

**2026 - All Rights Reserved**
#   g h a r e l u - s e w a