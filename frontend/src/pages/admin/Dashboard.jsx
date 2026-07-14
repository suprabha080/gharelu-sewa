import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  Users, Calendar, Shield, Star, ArrowRight, TrendingUp,
  CheckCircle, Clock, BarChart2, AlertTriangle, DollarSign,
  Activity, Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminAPI.getPlatformStats(),
      adminAPI.getAllBookings({ limit: 5 }),
      adminAPI.getPendingProviders({ limit: 5 }),
    ]).then(([statsRes, bookingsRes, providersRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || {});
      if (bookingsRes.status === 'fulfilled') {
        const d = bookingsRes.value.data;
        setRecentBookings(Array.isArray(d) ? d.slice(0, 5) : []);
      }
      if (providersRes.status === 'fulfilled') {
        const d = providersRes.value.data;
        setPendingProviders(Array.isArray(d) ? d.slice(0, 4) : []);
      }
      setLoading(false);
    });
  }, []);

  const kpis = [
    {
      label: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: '#6366f1',
      bg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      sub: 'Registered users',
    },
    {
      label: 'Verified Providers',
      value: stats?.verified_providers || 0,
      icon: CheckCircle,
      color: '#10b981',
      bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      sub: 'Active & verified',
    },
    {
      label: 'Pending KYC',
      value: stats?.pending_providers || 0,
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      sub: 'Awaiting review',
    },
    {
      label: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: Calendar,
      color: '#0ea5e9',
      bg: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      sub: `${stats?.completed_bookings || 0} completed`,
    },
    {
      label: 'Active Jobs',
      value: stats?.active_bookings || 0,
      icon: Activity,
      color: '#ec4899',
      bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      sub: 'Currently in progress',
    },
    {
      label: 'Total Revenue',
      value: `Rs. ${stats?.total_revenue || 0}`,
      icon: DollarSign,
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      sub: 'Platform commission',
    },
  ];

  const statusColor = (s) => {
    const m = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return m[s] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Platform Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time dashboard for Gharelu Sewa operations</p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
                style={{ background: kpi.bg }}
              >
                <div className="absolute right-3 top-3 opacity-20">
                  <Icon className="w-16 h-16" />
                </div>
                <Icon className="w-5 h-5 mb-3 opacity-90" />
                <div className="text-3xl font-black leading-none">{kpi.value}</div>
                <div className="text-sm font-bold mt-1 opacity-95">{kpi.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{kpi.sub}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Two-column panels */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#07535f]" /> Recent Bookings
            </h2>
            <Link to="/admin/bookings" className="text-xs text-[#07535f] font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No bookings found</div>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="px-5 py-3 flex justify-between items-center hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{b.service_category}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.customer_name} → {b.provider_name || 'Unassigned'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor(b.status)}`}>
                    {b.status?.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending KYC */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" /> Pending KYC Verifications
              {pendingProviders.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{pendingProviders.length}</span>
              )}
            </h2>
            <Link to="/admin/providers" className="text-xs text-[#07535f] font-bold hover:underline flex items-center gap-1">
              Review All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingProviders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                All providers are verified! 🎉
              </div>
            ) : (
              pendingProviders.map((p) => (
                <div key={p.id} className="px-5 py-3 flex justify-between items-center hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#07535f]/10 flex items-center justify-center text-[#07535f] font-bold text-sm">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.service_category || 'General'} • {p.ward || 'N/A'}</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/providers"
                    className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Verify Providers', to: '/admin/providers', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'View All Users', to: '/admin/users', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'All Bookings', to: '/admin/bookings', icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
          { label: 'Analytics', to: '/admin/analytics', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.to}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${action.bg} ${action.border} hover:shadow-md transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} border ${action.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className={`text-xs font-bold ${action.color}`}>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
