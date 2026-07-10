import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import BrowseServices from './pages/customer/BrowseServices';
import BookingDetails from './pages/customer/BookingDetails';
import BookingHistory from './pages/customer/BookingHistory';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderProfile from './pages/provider/Profile';
import MyBookings from './pages/provider/MyBookings';
import MyEarnings from './pages/provider/Earnings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageProviders from './pages/admin/ManageProviders';
import Analytics from './pages/admin/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredRole="customer">
            <Routes>
              <Route path="/" element={<CustomerDashboard />} />
              <Route path="/browse" element={<BrowseServices />} />
              <Route path="/bookings/:bookingId" element={<BookingDetails />} />
              <Route path="/history" element={<BookingHistory />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Provider Routes */}
      <Route
        path="/provider/*"
        element={
          <ProtectedRoute requiredRole="provider">
            <Routes>
              <Route path="/" element={<ProviderDashboard />} />
              <Route path="/profile" element={<ProviderProfile />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/earnings" element={<MyEarnings />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/providers" element={<ManageProviders />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p>&copy; 2025 Gharelu Sewa. All rights reserved.</p>
              <p className="text-sm text-gray-500 mt-2">Connecting you with trusted local service providers</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
