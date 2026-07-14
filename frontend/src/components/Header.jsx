import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, LogOut, Home, Search, Calendar, User, ChevronDown, Shield, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { onNotification } from '../services/socket';

export const Header = () => {
  const { user, logout, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initial notifications
      notificationAPI.getNotifications({ limit: 5 })
        .then(res => {
          const fetchedNotifs = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
          setNotifications(fetchedNotifs);
        })
        .catch(err => console.warn('Failed to fetch notifications', err));

      notificationAPI.getUnreadCount()
        .then(res => {
          setUnreadCount(res.data?.count || 0);
        })
        .catch(err => console.warn('Failed to fetch unread count', err));

      // Listen for incoming socket notifications
      onNotification((data) => {
        setNotifications(prev => [{ ...data, id: Date.now(), created_at: new Date().toISOString() }, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }
  }, [isAuthenticated]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.warn('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn('Failed to mark all as read', err);
    }
  };

  const getRolePath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/';
      case 'provider':
        return '/provider';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };
  // Mock toggle between User and Provider
  const currentRole = user?.role || 'customer';

  const handleRoleToggle = async (newRole) => {
    try {
      if (newRole === 'customer') {
        await login('priya@gmail.com', 'password');
        navigate('/');
      } else if (newRole === 'provider') {
        await login('rajesh@gmail.com', 'password');
        navigate('/provider');
      }
    } catch (err) {
      console.warn('Authentication switch error:', err);
      // Fallback redirection if DB/Auth is offline
      if (newRole === 'customer') {
        navigate('/');
      } else {
        navigate('/provider');
      }
    }
  };



  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#07535f] flex items-center justify-center text-white font-extrabold text-2xl font-serif">
              G
            </div>
            <span className="font-bold text-2xl flex items-center tracking-tight">
              <span className="text-[#07535f]">Gharelu</span>
              <span className="text-[#10b981]">Sewa</span>
            </span>
          </Link>

          {/* Center Navigation — role-aware */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {currentRole === 'provider' ? (
              /* Provider Nav */
              <>
                <Link
                  to="/provider"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/provider' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/provider/find-jobs"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/provider/find-jobs' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Browse</span>
                </Link>
                <Link
                  to="/provider/bookings"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/provider/bookings' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>
                <Link
                  to="/provider/earnings"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/provider/earnings' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Earnings</span>
                </Link>
              </>
            ) : currentRole === 'admin' ? (
              /* Admin Nav */
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/admin' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  to="/admin/providers"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/admin/providers' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>KYC Verifications</span>
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/admin/analytics' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
              </>
            ) : (
              /* Customer / Guest Nav */
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/customer/browse"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/customer/browse' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Services</span>
                </Link>
                <Link
                  to="/book"
                  className="flex items-center gap-1.5 bg-[#07535f] text-white px-4 py-2 rounded-full hover:bg-[#06424b] transition-all font-semibold shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Now</span>
                </Link>
                <Link
                  to="/track"
                  className={`flex items-center gap-1.5 hover:text-[#07535f] transition-colors ${
                    location.pathname === '/track' ? 'text-[#07535f] font-semibold' : ''
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Track Job</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User / Provider toggle switch */}
            <div className="bg-gray-100 p-0.5 rounded-full flex items-center text-xs font-semibold text-gray-500">
              <button
                onClick={() => handleRoleToggle('customer')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currentRole === 'customer' || currentRole === 'admin'
                    ? 'bg-white text-gray-800 shadow-sm font-bold'
                    : 'hover:text-gray-800'
                }`}
              >
                User
              </button>
              <button
                onClick={() => handleRoleToggle('provider')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currentRole === 'provider'
                    ? 'bg-white text-gray-800 shadow-sm font-bold'
                    : 'hover:text-gray-800'
                }`}
              >
                Provider
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#10b981] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-50 font-bold text-gray-800 flex justify-between items-center bg-gray-50/50">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-[10px] text-[#07535f] hover:underline font-semibold bg-[#07535f]/10 px-2 py-1 rounded-full">
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3 border-b border-gray-50 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                          onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                        >
                          <div className="text-gray-700">{n.message}</div>
                          <div className="text-xs text-gray-400 mt-1 font-medium">
                            {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                <img
                  src={user?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
                  alt={user?.name || "Priya M."}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className="hidden lg:flex items-center gap-1 cursor-pointer group" onClick={() => logout()}>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-red-500 transition-colors">
                    {user?.name || "Priya M."}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500" />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-[#07535f] hover:bg-gray-50 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-[#07535f] hover:bg-[#06424b] rounded-lg transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-3 mt-3 text-sm font-medium text-gray-600">
              <Link to="/" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link to="/customer/browse" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Search className="w-4 h-4" /> Services
              </Link>
              <Link to="/book" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg bg-[#07535f] text-white flex items-center gap-2 justify-center font-bold">
                <Calendar className="w-4 h-4" /> Book Now
              </Link>
              <Link to="/track" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4" /> Track Job
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                    navigate('/login');
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
