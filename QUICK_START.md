# 🚀 QUICK START GUIDE - Gharelu Sewa

## Step 1: Download & Extract
- Extract the `gharelu-sewa` folder to your projects directory

## Step 2: Setup Backend

```bash
cd gharelu-sewa/backend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Edit .env - set your database details
# Important: Make sure PostgreSQL is running
# Default values:
#   DB_HOST=localhost
#   DB_PORT=5432
#   DB_NAME=gharelu_sewa
#   DB_USER=postgres
#   DB_PASSWORD=postgres

# 4. Start backend server
npm run dev
```

✅ Backend should be running on http://localhost:5000

## Step 3: Setup Frontend (New Terminal)

```bash
cd gharelu-sewa/frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

✅ Frontend should be running on http://localhost:5173

## Step 4: Access Application

Open browser and go to:
```
http://localhost:5173
```

## Step 5: Test with Demo Credentials

### Customer Account
- Email: `customer@test.com`
- Password: `password123`

### Provider Account
- Email: `provider@test.com`
- Password: `password123`

### Admin Account
- Email: `admin@test.com`
- Password: `password123`

---

## 🔧 First Time Setup Only

### Create PostgreSQL Database

**For Windows:**
```bash
createdb -U postgres gharelu_sewa
```

**For Mac/Linux:**
```bash
sudo -u postgres createdb gharelu_sewa
```

The backend will automatically create all tables when you start it!

---

## ⚡ Quick Troubleshooting

### "Cannot find module" Error
```bash
# In backend or frontend folder
rm -rf node_modules
npm install
```

### Database Connection Error
- [ ] Is PostgreSQL running?
- [ ] Check credentials in `.env`
- [ ] Port 5432 is not blocked

### Port Already in Use
```bash
# Find process on port
lsof -i :5000    # Backend
lsof -i :5173    # Frontend

# Kill process (if needed)
kill -9 <PID>
```

### CORS Error
- [ ] Backend .env has: `FRONTEND_URL=http://localhost:5173`
- [ ] Restart both servers

---

## 📁 Project Structure

```
gharelu-sewa/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # DB & Socket setup
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & errors
│   │   └── server.js       # Start here
│   └── package.json
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # Page screens
│   │   ├── services/       # API calls
│   │   ├── context/        # Auth state
│   │   └── App.jsx         # Main router
│   └── package.json
│
└── README.md               # Full documentation
```

---

## 🎯 What Each Role Can Do

### 👤 Customer
- Browse service providers
- Book services
- Chat with providers
- Rate & review services
- Track bookings

### 🔧 Service Provider
- Create profile
- Receive booking requests
- Accept/decline jobs
- Chat with customers
- Track earnings

### ⚙️ Administrator
- Verify new providers
- Manage categories
- View analytics
- Monitor all bookings
- Manage users

---

## 📚 Key Features Implemented

✅ User authentication (JWT + bcrypt)
✅ Three role-based dashboards
✅ Real-time notifications (Socket.IO)
✅ Service booking system
✅ In-booking chat
✅ Rating & reviews
✅ Admin analytics
✅ Responsive design
✅ Database with 7 tables
✅ 20+ API endpoints

---

## 🎓 Learning Resources Inside Code

- **Authentication**: `backend/src/middleware/auth.js`
- **API Routes**: `backend/src/routes/`
- **Real-time**: `backend/src/config/socket.js`
- **Database**: `backend/src/config/initDb.js`
- **React Components**: `frontend/src/components/`
- **API Client**: `frontend/src/services/api.js`

---

## 🚀 Next Steps After Running

1. **Explore the dashboards** with demo accounts
2. **Test real-time features** (open 2 browsers)
3. **Check API endpoints** in backend README
4. **Customize** colors in `frontend/tailwind.config.js`
5. **Deploy** to Vercel (frontend) and Render (backend)

---

## ❓ Need Help?

1. Check **README.md** for full documentation
2. Search **troubleshooting section**
3. Check browser **console** for errors
4. Check **terminal output** for backend errors

---

**Happy coding! 🎉**

For any issues, refer to the complete README.md file.
