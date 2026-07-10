import React from 'react';
import Card from '../../components/Card';

export default function BookingHistory() {
  return (
    <div className="page-container">
      <h1 className="section-title">Booking History</h1>
      <Card>
        <p className="text-center text-gray-500 py-12">No bookings yet</p>
      </Card>
    </div>
  );
}
