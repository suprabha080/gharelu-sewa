import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, providerAPI } from '../../services/api';
import Card from '../../components/Card';
import { 
  AlertCircle, Star, DollarSign, Calendar, Clock, 
  MapPin, Phone, Check, X, ArrowRight, TrendingUp, 
  Award, ShieldCheck, Zap, Sparkles, UserCheck, Flame
} from 'lucide-react';
import { format, isToday } from 'date-fns';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings();
      const list = Array.isArray(res.data) ? res.data : [];
      setBookings(list);
      
      // Load availability from user object
      if (user && user.availability !== undefined) {
        setAvailability(user.availability);
      }
    } catch (err) {
      console.error('Failed to load provider bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const nextAvailability = !availability;
      await providerAPI.toggleAvailability({ availability: nextAvailability });
      setAvailability(nextAvailability);
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    } finally {
      setActionLoading(null);
    }
  };

  const isVerified = user?.is_verified;

  // Filter bookings
  const newRequests = bookings.filter(b => b.status === 'pending');
  const activeJobs = bookings.filter(b => b.status === 'accepted' || b.status === 'in_progress');
  const completedJobs = bookings.filter(b => b.status === 'completed');
  
  // Today's schedule
  const todaySchedule = bookings
    .filter(b => b.booking_date && isToday(new Date(b.booking_date)) && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));

  // Earnings calculations
  const hourlyRate = parseFloat(user?.hourly_rate || 600);
  const totalCompletedEarnings = completedJobs.length * hourlyRate;
  const platformFee = totalCompletedEarnings * 0.10;
  const netPayout = totalCompletedEarnings - platformFee;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* KYC Pending Banner */}
        {!isVerified && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-4 shadow-sm animate-pulse">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-800 text-lg">Account Pending Verification</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your account is currently under review by our administration team. You will not receive any service requests or appear in search results until your KYC documents are verified.
              </p>
            </div>
          </div>
        )}

        {/* Premium Provider Profile Card Header */}
        <div className="bg-[#07535f] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden flex-shrink-0 border-2 border-white/20">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#10b981]/20 flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.charAt(0) || 'P'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
                <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                  <span>{user?.service_category || 'General Provider'}</span> • <span>{user?.ward || 'Pokhara'}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">4.9</span>
                  <span className="text-xs text-white/60">(142 reviews)</span>
                  <span className={`ml-2 w-2.5 h-2.5 rounded-full ${availability ? 'bg-[#10b981]' : 'bg-red-400'} inline-block`}></span>
                  <span className="text-xs">{availability ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Toggle Availability & Schedule */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleToggleAvailability}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm"
              >
                Go {availability ? 'Offline' : 'Online'}
              </button>
              <Link 
                to="/provider/profile"
                className="bg-[#10b981] hover:bg-[#0ea572] text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                Edit Profile
              </Link>
            </div>

          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${!isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card className="p-5 border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Earnings</p>
              <p className="text-xl font-black text-gray-800 mt-1">Rs. {totalCompletedEarnings.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-5 border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Completed Today</p>
              <p className="text-xl font-black text-gray-800 mt-1">{completedJobs.length} Jobs</p>
            </div>
          </Card>

          <Card className="p-5 border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#07535f]/10 flex items-center justify-center text-[#07535f] flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active Now</p>
              <p className="text-xl font-black text-gray-800 mt-1">{activeJobs.length} Jobs</p>
            </div>
          </Card>

          <Card className="p-5 border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Acceptance Rate</p>
              <p className="text-xl font-black text-gray-800 mt-1">94%</p>
            </div>
          </Card>
        </div>

        {/* Dashboard Panels Grid */}
        <div className={`grid lg:grid-cols-3 gap-6 ${!isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* Column 1: New Requests & Today's Schedule */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* New Requests Panel */}
            <Card className="p-6 border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  New Requests
                  {newRequests.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-black">
                      {newRequests.length}
                    </span>
                  )}
                </h2>
                <Link to="/provider/bookings" className="text-xs text-[#07535f] font-bold hover:underline">View All</Link>
              </div>

              {loading ? (
                <div className="text-center text-sm text-gray-400 py-6">Loading requests...</div>
              ) : newRequests.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  No new service requests right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {newRequests.map(req => (
                    <div key={req.id} className="border border-gray-100 p-4 rounded-2xl bg-white shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2.5 items-center">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#07535f] font-extrabold text-sm">
                            {req.customer_name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{req.customer_name}</p>
                            <p className="text-xs text-gray-400 font-medium">{req.service_category}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-[#07535f] text-sm">Rs. {hourlyRate}</span>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2.5 rounded-xl">
                        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0" /> {format(new Date(req.booking_date), 'PPP p')}</p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> {req.location}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          disabled={actionLoading === req.id}
                          className="flex-1 bg-[#10b981] hover:bg-[#0ea572] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                          disabled={actionLoading === req.id}
                          className="flex-1 bg-white border border-red-100 hover:bg-red-50 text-red-500 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Today's Schedule Panel */}
            <Card className="p-6 border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Today's Schedule</h2>
              {todaySchedule.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  No jobs scheduled for today.
                </div>
              ) : (
                <div className="relative border-l border-gray-200 ml-3 pl-5 space-y-6">
                  {todaySchedule.map(sched => (
                    <div key={sched.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#07535f] ring-4 ring-white"></span>
                      <div>
                        <span className="text-xs font-bold text-[#07535f] block">
                          {format(new Date(sched.booking_date), 'h:mm a')}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm mt-0.5">{sched.service_category}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{sched.location} • {sched.customer_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>

          {/* Column 2: Active Jobs & Weekly Progress */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Active Jobs */}
            <Card className="p-6 border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Active Jobs</h2>
              {activeJobs.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  No active jobs right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map(job => (
                    <div key={job.id} className="border border-gray-100 p-4 rounded-2xl bg-white shadow-sm space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07535f]/15 flex items-center justify-center text-[#07535f] font-extrabold text-xs">
                            {job.customer_name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{job.customer_name}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">{job.service_category}</p>
                          </div>
                        </div>
                        <span className="bg-[#07535f]/10 text-[#07535f] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0" /> {format(new Date(job.booking_date), 'h:mm a')} slot</p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> {job.location}</p>
                      </div>

                      <div className="flex gap-2">
                        {job.status === 'accepted' ? (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'in_progress')}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Start Job
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(job.id, 'completed')}
                            className="flex-1 bg-[#10b981] hover:bg-[#0ea572] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Complete Job
                          </button>
                        )}
                        <Link
                          to={`/provider/bookings/${job.id}`}
                          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-bold transition-all text-center border border-gray-100"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Performance Stats */}
            <Card className="p-6 border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-2">This Week Performance</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Jobs Completed</span>
                    <span>18</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#07535f] h-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>On-time Rate</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#10b981] h-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Customer Rating</span>
                    <span>98%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

          </div>

          {/* Column 3: Payouts & Badges */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Payout Summary Panel */}
            <Card className="p-6 border-gray-100 space-y-4">
              <h2 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-2">Payouts</h2>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Gross Earnings</span>
                  <span className="font-bold text-gray-800">Rs. {totalCompletedEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Platform Fee (10%)</span>
                  <span>- Rs. {platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#07535f] text-base border-t border-dashed border-gray-100 pt-3 mt-3">
                  <span>Net Payout</span>
                  <span>Rs. {netPayout.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#10b981]/5 border border-[#10b981]/15 p-3 rounded-2xl text-[11px] text-[#0e9568] font-bold text-center">
                💵 Verified payments are instantly credited to your Net Payout balance.
              </div>

              <button 
                onClick={() => alert(`Payout request of Rs. ${netPayout} sent to Admin!`)}
                disabled={netPayout <= 0}
                className="w-full bg-[#07535f] hover:bg-[#06424b] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                Request Payout — Rs. {netPayout.toLocaleString()}
              </button>
            </Card>

            {/* Badges Panel */}
            <Card className="p-6 border-gray-100">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Your Badges</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 border border-green-100/50 rounded-2xl flex flex-col items-center text-center">
                  <Award className="w-6 h-6 text-green-600 mb-1" />
                  <span className="text-[10px] font-bold text-green-700">Top Rated</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100/50 rounded-2xl flex flex-col items-center text-center">
                  <Zap className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-blue-700">Fast Response</span>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100/50 rounded-2xl flex flex-col items-center text-center">
                  <Sparkles className="w-6 h-6 text-yellow-600 mb-1" />
                  <span className="text-[10px] font-bold text-yellow-700">Premium Pro</span>
                </div>
                <div className="p-3 bg-red-50 border border-red-100/50 rounded-2xl flex flex-col items-center text-center">
                  <Flame className="w-6 h-6 text-red-600 mb-1" />
                  <span className="text-[10px] font-bold text-red-700">Local Expert</span>
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
