import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

export default function ProviderDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.name}!</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Active Jobs</p>
            <p className="text-3xl font-bold text-primary-500">0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-500">0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Earnings</p>
            <p className="text-3xl font-bold text-blue-500">₹0</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-3xl font-bold text-yellow-500">0</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/provider/profile" className="text-primary-500 hover:text-primary-600">
              Edit Profile →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/provider/bookings" className="text-primary-500 hover:text-primary-600">
              View Bookings →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/provider/earnings" className="text-primary-500 hover:text-primary-600">
              View Earnings →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
