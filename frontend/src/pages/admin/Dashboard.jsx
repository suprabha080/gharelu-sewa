import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  Users, Calendar, Shield, ArrowRight, ArrowUpRight, ArrowDownRight,
  RefreshCw, Download, CreditCard, LayoutGrid, DollarSign,
  PieChart as PieChartIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    adminAPI.getPlatformStats().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const tabs = [
    { name: 'Overview', icon: LayoutGrid },
    { name: 'Users', icon: Users },
    { name: 'Providers', icon: Shield },
    { name: 'Bookings', icon: Calendar },
    { name: 'Services', icon: PieChartIcon },
    { name: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header section matching UX pilot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#031d22] font-serif tracking-tight">Admin Control Center</h1>
          <p className="text-gray-500 text-sm mt-1">Manage users, providers, and overall platform operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
          <button className="flex items-center gap-2 bg-[#07535f] hover:bg-[#06424b] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md">
            <ArrowUpRight className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-lg transition-all">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-extrabold text-[#031d22] tracking-tight">
            Rs. {stats?.total_revenue?.toLocaleString() || '45,231'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+20.1% from last month</span>
          </div>
          <div className="absolute right-5 top-5 w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-lg transition-all">
          <p className="text-gray-500 text-sm font-medium mb-1">Active Users</p>
          <h3 className="text-3xl font-extrabold text-[#031d22] tracking-tight">
            +{stats?.total_customers?.toLocaleString() || '2,350'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+180.1% from last month</span>
          </div>
          <div className="absolute right-5 top-5 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Service Providers */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-lg transition-all">
          <p className="text-gray-500 text-sm font-medium mb-1">Service Providers</p>
          <h3 className="text-3xl font-extrabold text-[#031d22] tracking-tight">
            {stats?.verified_providers?.toLocaleString() || '1,234'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-rose-500 text-[11px] font-bold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-4% from last month</span>
          </div>
          <div className="absolute right-5 top-5 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-lg transition-all">
          <p className="text-gray-500 text-sm font-medium mb-1">Active Bookings</p>
          <h3 className="text-3xl font-extrabold text-[#031d22] tracking-tight">
            +{stats?.active_bookings || '573'}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+201 since last hour</span>
          </div>
          <div className="absolute right-5 top-5 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-white border border-gray-100 rounded-xl shadow-sm w-fit max-w-full hide-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                isActive 
                  ? 'bg-gray-50 text-gray-900 shadow-sm border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue & Bookings Bar Chart (CSS based) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#031d22]">Revenue & Bookings Growth</h3>
            <p className="text-sm text-gray-500 mt-1">Visualizing platform activity over the last 7 days.</p>
          </div>
          
          <div className="relative h-64 flex items-end justify-between gap-4 px-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
              <span>10000</span>
              <span>7500</span>
              <span>5000</span>
              <span>2500</span>
              <span>0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute left-10 right-0 top-1.5 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-b border-dashed border-gray-200"></div>
              <div className="w-full border-b border-dashed border-gray-200"></div>
              <div className="w-full border-b border-dashed border-gray-200"></div>
              <div className="w-full border-b border-dashed border-gray-200"></div>
              <div className="w-full border-b border-gray-200"></div>
            </div>

            {/* Bars */}
            <div className="flex-1 flex justify-between items-end pl-12 pr-4 h-[calc(100%-2rem)] z-10">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = [40, 30, 50, 28, 68, 85, 55];
                return (
                  <div key={day} className="flex flex-col items-center w-8 group">
                    <div 
                      className="w-full bg-[#7c3aed] rounded-t-sm group-hover:bg-[#6d28d9] transition-all cursor-pointer relative"
                      style={{ height: `${heights[i]}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {heights[i] * 100}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-gray-500 mt-3">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Services Distribution Donut (CSS based) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#031d22]">Services Distribution</h3>
            <p className="text-sm text-gray-500 mt-1">Most popular categories by volume.</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative my-4">
            {/* CSS pure donut chart using conic-gradient */}
            <div className="relative w-52 h-52 rounded-full flex items-center justify-center animate-[spin_1s_ease-out_reverse]" 
                 style={{
                   background: 'conic-gradient(from 0deg, #7c3aed 0% 30%, transparent 30% 32%, #ef4444 32% 55%, transparent 55% 57%, #10b981 57% 80%, transparent 80% 82%, #f59e0b 82% 98%, transparent 98% 100%)'
                 }}>
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-auto pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7c3aed]"></span>
              <span className="text-xs font-semibold text-gray-600">Cleaning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
              <span className="text-xs font-semibold text-gray-600">Electrical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
              <span className="text-xs font-semibold text-gray-600">Plumbing</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
