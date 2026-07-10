import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  Users, Calendar, Shield, Star, ArrowRight,
  Loader, TrendingUp, CheckCircle, Clock, BarChart2
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getPlatformStats()
      .then(res => setStats(res.data || {}))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Total Users',        value: stats?.total_users || stats?.users || 0,                     icon: Users,         color: '#6366f1', bg: '#eef2ff' },
    { label: 'Total Bookings',     value: stats?.total_bookings || stats?.bookings || 0,               icon: Calendar,      color: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Pending KYC',        value: stats?.pending_providers || stats?.pending_verifications || 0, icon: Shield,      color: '#ca8a04', bg: '#fefce8' },
    { label: 'Avg Rating',         value: stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : '—', icon: Star,        color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Completed Jobs',     value: stats?.completed_bookings || stats?.completed || 0,          icon: CheckCircle,   color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Active Providers',   value: stats?.active_providers || stats?.total_providers || 0,      icon: TrendingUp,    color: '#db2777', bg: '#fdf2f8' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b' }}>Platform management and overview</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Loader style={{ width: 28, height: 28, margin: '0 auto 0.75rem' }} />
          <p>Loading stats…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} style={{ background: kpi.bg, borderRadius: '14px', padding: '1.25rem', border: `1px solid ${kpi.color}22` }}>
                <Icon style={{ width: 22, height: 22, color: kpi.color, marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{kpi.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Access Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {[
          {
            title: 'Manage Providers',
            desc: 'Review KYC submissions, verify or reject provider applications',
            icon: Shield,
            color: '#6366f1',
            link: '/admin/providers',
            linkLabel: 'View Providers',
            badge: stats?.pending_providers ? `${stats.pending_providers} pending` : null,
            badgeBg: '#fef9c3',
            badgeColor: '#92400e',
          },
          {
            title: 'Analytics & Revenue',
            desc: 'Platform performance, revenue reports, booking trends',
            icon: BarChart2,
            color: '#16a34a',
            link: '/admin/analytics',
            linkLabel: 'View Analytics',
            badge: null,
          },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: `${card.color}15`, borderRadius: '10px', padding: '0.625rem' }}>
                  <Icon style={{ width: 22, height: 22, color: card.color }} />
                </div>
                {card.badge && (
                  <span style={{ background: card.badgeBg, color: card.badgeColor, padding: '3px 10px', borderRadius: 20, fontSize: '0.73rem', fontWeight: 700 }}>
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{card.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{card.desc}</p>
              <Link
                to={card.link}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: card.color, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
              >
                {card.linkLabel} <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
