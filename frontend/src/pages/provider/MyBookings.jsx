import React from 'react';
import Card from '../../components/Card';

export default function MyBookings() {
  return (
    <div className="page-container">
      <h1 className="section-title">My Bookings</h1>
      <Card>
        <p className="text-center text-gray-500 py-12">No active bookings</p>
      </Card>
    </div>
  );
}
