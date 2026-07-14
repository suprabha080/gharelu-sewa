import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import { onNotification } from '../services/socket';
import { 
  LayoutDashboard, Users, Calendar, ShieldCheck, 
  BarChart2, LogOut, Settings, Bell, Menu, X, ArrowLeft
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getNotifications({ limit: 5 })
        .then(res => {
          const fetchedNotifs = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
          setNotifications(fetchedNotifs);
        })
        .catch(err => console.warn('Failed to fetch admin notifications', err));

      notificationAPI.getUnreadCount()
        .then(res => {
          setUnreadCount(res.data?.count || 0);
        })
        .catch(err => console.warn('Failed to fetch admin unread count', err));

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

  const menuItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'KYC & Providers', path: '/admin/providers', icon: ShieldCheck },
    { label: 'User Database', path: '/admin/users', icon: Users },
    { label: 'Platform Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#053c45] text-white shrink-0 flex flex-col justify-between border-r border-[#07535f]/30">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-[#07535f]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white font-extrabold text-lg">
                A
              </div>
              <span className="font-bold text-lg tracking-tight">
                Gharelu<span className="text-[#10b981]">Admin</span>
              </span>
            </div>
            <Link to="/" className="text-xs text-gray-300 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#10b981] text-white shadow-md'
                      : 'text-gray-300 hover:bg-[#07535f] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile */}
        <div className="p-4 border-t border-[#07535f]/30 bg-[#04333b]">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
              alt="Admin"
              className="w-9 h-9 rounded-full object-cover border border-[#10b981]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-gray-400 truncate">System Controller</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {/* Admin topbar */}
        <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#07535f] bg-[#07535f]/10 px-2.5 py-1 rounded-full">
              Live Monitor
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
                <Bell className="w-5 h-5" />
              </button>

              {/* Admin Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-50 font-bold text-gray-800 flex justify-between items-center bg-gray-50/50">
                    <span>Admin Alerts</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllAsRead} className="text-[10px] text-[#07535f] hover:underline font-semibold bg-[#07535f]/10 px-2 py-1 rounded-full">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No new alerts</div>
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
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span className="text-xs font-bold text-gray-600">Database Connected</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
