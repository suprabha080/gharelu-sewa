import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerAPI, paymentAPI } from '../../services/api';
import Card from '../../components/Card';
import {
  TrendingUp, DollarSign, Calendar, Clock,
  Award, ChevronRight, Loader, AlertCircle, BarChart2
} from 'lucide-react';
import { format } from 'date-fns';

const PERIOD_OPTIONS = [
  { label: 'This Week',  value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year',  value: 'year' },
  { label: 'All Time',   value: 'all' },
];

export default function MyEarnings() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [earnings, setEarnings] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await providerAPI.getEarnings({ period });
      const data = res.data || {};
      setEarnings(data);
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      setError('Could not load earnings data.');
      // Use empty fallback so we still render something
      setEarnings({ total: 0, jobs: 0, avg: 0 });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const total      = earnings?.total     || 0;
  const jobsCount  = earnings?.jobs      || earnings?.count || 0;
  const avg        = jobsCount > 0 ? Math.round(total / jobsCount) : 0;
  const commission = Math.round(total * 0.10);
  const net        = total - commission;

  const barMax = payments.length ? Math.max(...payments.map(p => Number(p.amount) || 0)) : 1;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>My Earnings</h1>
          <p style={{ color: '#64748b' }}>Track your income and platform commission</p>
        </div>
        {/* Period filter */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '7px',
                border: 'none',
                background: period === opt.value ? 'white' : 'transparent',
                color: period === opt.value ? '#1e293b' : '#64748b',
                fontWeight: period === opt.value ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: period === opt.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          <Loader style={{ width: 32, height: 32, margin: '0 auto 1rem' }} />
          <p>Loading earnings…</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              {
                label: 'Gross Earnings',
                value: `Rs ${total.toLocaleString()}`,
                icon: DollarSign,
                color: '#6366f1',
                bg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              },
              {
                label: 'Net (After 10% Commission)',
                value: `Rs ${net.toLocaleString()}`,
                icon: TrendingUp,
                color: '#16a34a',
                bg: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              },
              {
                label: 'Platform Commission',
                value: `Rs ${commission.toLocaleString()}`,
                icon: BarChart2,
                color: '#ca8a04',
                bg: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
              },
              {
                label: 'Jobs Completed',
                value: jobsCount,
                icon: Award,
                color: '#db2777',
                bg: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
              },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ opacity: 0.15, position: 'absolute', right: '-10px', bottom: '-10px' }}>
                    <Icon style={{ width: 72, height: 72 }} />
                  </div>
                  <Icon style={{ width: 24, height: 24, marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2px' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Average per job */}
          {jobsCount > 0 && (
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar style={{ width: 20, height: 20, color: '#16a34a' }} />
              <div>
                <span style={{ fontWeight: 700, color: '#15803d' }}>Rs {avg.toLocaleString()}</span>
                <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.875rem' }}>average per job this {period}</span>
              </div>
            </div>
          )}

          {/* Payment History Table */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>Payment History</h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{payments.length} transactions</span>
            </div>

            {payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <DollarSign style={{ width: 40, height: 40, margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>No payments for this period</p>
              </div>
            ) : (
              <div>
                {payments.map((p, i) => {
                  const amt = Number(p.amount) || 0;
                  const barWidth = barMax > 0 ? Math.round((amt / barMax) * 100) : 0;
                  const dateStr = p.paid_at
                    ? format(new Date(p.paid_at), 'dd MMM yyyy')
                    : p.created_at
                    ? format(new Date(p.created_at), 'dd MMM yyyy')
                    : '—';

                  return (
                    <div
                      key={p.id || i}
                      style={{
                        padding: '1rem 1.5rem',
                        borderBottom: i < payments.length - 1 ? '1px solid #f8fafc' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      {/* Bar visual */}
                      <div style={{ width: 6, height: 36, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ width: '100%', height: `${barWidth}%`, background: '#6366f1', borderRadius: 3, transition: 'height 0.3s' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                          Booking #{p.booking_id || p.id}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{dateStr}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>Rs {amt.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Net: Rs {Math.round(amt * 0.9).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ padding: '3px 10px', background: p.status === 'completed' ? '#f0fdf4' : '#fef9c3', borderRadius: 20, fontSize: '0.73rem', fontWeight: 600, color: p.status === 'completed' ? '#15803d' : '#a16207', flexShrink: 0 }}>
                        {p.status === 'completed' ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info note */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef9c3', borderRadius: '10px', fontSize: '0.8rem', color: '#92400e' }}>
            💡 <strong>Commission Policy:</strong> Gharelu Sewa deducts a 10% platform commission from each completed payment. Your net earnings are deposited within 2–3 business days.
          </div>
        </>
      )}
    </div>
  );
}
