import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

export default function AdminDashboard() {
  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Platform management and analytics</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Active Bookings</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Pending Providers</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Avg Rating</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Manage Providers</h3>
          <Link to="/admin/providers" className="text-primary-500">
            View All →
          </Link>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Analytics</h3>
          <Link to="/admin/analytics" className="text-primary-500">
            View Dashboard →
          </Link>
        </Card>
      </div>
    </div>
  );
}
