import React, { useState, useEffect } from 'react';
import { publicFetch, adminFetch, apiEndpoints } from '../config/api';

const AdminBookingManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // ✅ Fix: Use correct endpoint format
      let response;
      if (activeTab === 'pending') {
        response = await adminFetch(`${apiEndpoints.bookings.getAll}/pending`);
      } else {
        response = await adminFetch(`${apiEndpoints.bookings.getAll}/all`);
      }

      const data = await response.json();
      console.log('📊 Fetched bookings:', data);

      if (activeTab === 'pending') {
        setPendingBookings(data.bookings || []);
      } else {
        setAllBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      alert('Failed to fetch bookings. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to approve this booking?')) return;

    try {
      const response = await adminFetch(
        `${apiEndpoints.bookings.getAll}/${bookingId}/approve`,
        {
          method: 'PATCH',
        }
      );

      const data = await response.json();
      console.log('✅ Booking approved:', data);
      
      alert('Booking approved successfully! Confirmation email sent to customer.');
      fetchBookings();
    } catch (error) {
      console.error('❌ Error approving booking:', error);
      alert(error.message || 'Failed to approve booking');
    }
  };

  const handleRejectClick = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedBooking) return;

    try {
      const response = await adminFetch(
        `${apiEndpoints.bookings.getAll}/${selectedBooking._id}/reject`,
        {
          method: 'PATCH',
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      const data = await response.json();
      console.log('✅ Booking rejected:', data);

      alert('Booking rejected successfully! Notification sent to customer.');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('❌ Error rejecting booking:', error);
      alert(error.message || 'Failed to reject booking');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timeSlotDisplay = {
    morning: 'Morning Safari (5:30 AM - 9:30 AM)',
    afternoon: 'Afternoon Safari (2:30 PM - 6:30 PM)',
    extended: 'Extended Safari (5:30 AM - 12:00 PM)',
    fullDay: 'Full Day Safari (5:30 AM - 6:30 PM)'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  const bookingsToDisplay = activeTab === 'pending' ? pendingBookings : allBookings;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Management</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Approvals ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {bookingsToDisplay.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {activeTab === 'pending' ? 'No pending bookings' : 'No bookings found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookingsToDisplay.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{booking.bookingId}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(booking.status)}
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Customer Information</h4>
                  <p className="text-sm"><strong>Name:</strong> {booking.customerName}</p>
                  <p className="text-sm"><strong>Email:</strong> {booking.customerEmail}</p>
                  <p className="text-sm"><strong>Phone:</strong> {booking.customerPhone}</p>
                  <p className="text-sm"><strong>Type:</strong> {booking.visitorType === 'foreign' ? 'Foreign Visitor' : 'Local Visitor'}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                  <p className="text-sm"><strong>Date:</strong> {formatDate(booking.date)}</p>
                  <p className="text-sm"><strong>Time:</strong> {timeSlotDisplay[booking.timeSlot]}</p>
                  <p className="text-sm"><strong>People:</strong> {booking.people}</p>
                  <p className="text-sm"><strong>Park:</strong> <span className="capitalize">{booking.park || 'N/A'}</span></p>
                  <p className="text-sm"><strong>Guide:</strong> {booking.guideOption}</p>
                  <p className="text-sm"><strong>Meals:</strong> {booking.mealOption === 'with' ? 'Included' : 'Not Included'}</p>
                </div>
              </div>

              {booking.adminNotes && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm"><strong>Admin Notes:</strong> {booking.adminNotes}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(booking._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    ✓ Approve Booking
                  </button>
                  <button
                    onClick={() => handleRejectClick(booking)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    ✗ Reject Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Reject Booking</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this booking. The customer will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
              placeholder="Enter rejection reason (optional)..."
            />
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;
