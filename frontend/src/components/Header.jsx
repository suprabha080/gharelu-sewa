import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, LogOut, Home, Search, Calendar, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const notifications = [
    { id: 1, message: 'Rajesh Shrestha has been assigned to your service request.', time: '10:35 AM' },
    { id: 2, message: 'Booking #GS-20241105-789 has been confirmed.', time: '10:32 AM' }
  ];

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
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    <button 
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-[#07535f] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                    {unreadCount === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <p className="text-xs text-gray-700 font-medium">{n.message}</p>
                          <span className="text-[10px] text-gray-400 block mt-1">{n.time}</span>
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
