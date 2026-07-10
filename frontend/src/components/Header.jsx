import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, Home, Wrench, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { getSocket, onNotification } from '../services/socket';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      setupNotificationListener();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.unread);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const setupNotificationListener = () => {
    const socket = getSocket();
    if (socket) {
      onNotification(() => {
        fetchUnreadCount();
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    if (!user) return null;
    const iconClass = 'w-4 h-4';
    switch (user.role) {
      case 'customer':
        return <Home className={iconClass} />;
      case 'provider':
        return <Wrench className={iconClass} />;
      case 'admin':
        return <Users className={iconClass} />;
      default:
        return null;
    }
  };

  const getRolePath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/customer';
      case 'provider':
        return '/provider';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? getRolePath() : '/'} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center group-hover:shadow-md transition-shadow">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl text-gray-900">Gharelu Sewa</span>
          </Link>

          {/* Center Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex gap-8">
              <Link
                to={getRolePath()}
                className="text-gray-700 hover:text-primary-400 transition-colors flex items-center gap-1.5"
              >
                {getRoleIcon()}
                <span className="capitalize">{user?.role}</span>
              </Link>
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-primary-400 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {unreadCount === 0 ? (
                          <div className="p-4 text-center text-gray-500">No new notifications</div>
                        ) : (
                          <div className="p-4">
                            <p className="text-sm text-gray-600">{unreadCount} unread</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="hidden md:flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <img
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-500 transition-colors text-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-400 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-400 text-white hover:bg-primary-500 rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && isAuthenticated && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3 mt-3">
              <Link to={getRolePath()} className="px-4 py-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded hover:bg-red-50 text-red-600 flex items-center gap-2 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
