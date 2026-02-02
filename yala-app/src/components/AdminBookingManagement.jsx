import React, { useState, useEffect, useCallback } from 'react';
import { adminFetch, apiEndpoints } from '../config/api';

const AdminBookingManagement = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchBookings = useCallback(async () => {
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
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
      pending: 'bg-[#fee000]/20 text-[#856404] border border-[#fee000]/40',
      confirmed: 'bg-[#034123]/20 text-[#034123] border border-[#034123]/40',
      cancelled: 'bg-red-100/80 text-red-800 border border-red-300/60',
      completed: 'bg-blue-100/80 text-blue-800 border border-blue-300/60',
    };
    return (
      <span className={`inline-block px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-sm shadow-sm ${styles[status] || 'bg-gray-100/80 text-gray-800 border border-gray-300/60'}`}>
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034123] mb-4"></div>
        <div className="text-lg font-medium text-[#4b5563]">Loading bookings...</div>
      </div>
    );
  }

  const bookingsToDisplay = activeTab === 'pending' ? pendingBookings : allBookings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">Booking Management</h1>
        <p className="text-[#6b7280] text-base">Manage and approve safari bookings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === 'pending'
                ? 'bg-[#f26b21] text-white shadow-lg scale-105'
                : 'bg-[#f9fafb] text-[#4b5563] hover:bg-[#034123]/5 hover:text-[#034123]'
            }`}
          >
            Pending Approvals ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-[#f26b21] text-white shadow-lg scale-105'
                : 'bg-[#f9fafb] text-[#4b5563] hover:bg-[#034123]/5 hover:text-[#034123]'
            }`}
          >
            All Bookings ({allBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {bookingsToDisplay.length === 0 ? (
        <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-[#4b5563] text-lg font-medium">
            {activeTab === 'pending' ? 'No pending bookings' : 'No bookings found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookingsToDisplay.map((booking) => (
            <div key={booking._id} className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[#e5e7eb]">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2">{booking.bookingId}</h3>
                  <p className="text-sm text-[#6b7280]">
                    Created: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  {getStatusBadge(booking.status)}
                  <p className="text-2xl lg:text-3xl font-bold text-[#f26b21] mt-3">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#6b7280] mt-1">Total Amount</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-5 rounded-xl border border-[#e5e7eb]/60">
                  <h4 className="font-bold text-[#034123] text-base mb-4 border-b border-[#034123]/20 pb-2">Customer Information</h4>
                  <div className="space-y-2.5">
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Name:</span> <span className="text-[#4b5563]">{booking.customerName}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Email:</span> <span className="text-[#4b5563]">{booking.customerEmail}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Phone:</span> <span className="text-[#4b5563]">{booking.customerPhone}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Type:</span> <span className="text-[#4b5563]">{booking.visitorType === 'foreign' ? 'Foreign Visitor' : 'Local Visitor'}</span></p>
                  </div>
                </div>

                <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-5 rounded-xl border border-[#e5e7eb]/60">
                  <h4 className="font-bold text-[#034123] text-base mb-4 border-b border-[#034123]/20 pb-2">Booking Details</h4>
                  <div className="space-y-2.5">
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Date:</span> <span className="text-[#4b5563]">{formatDate(booking.date)}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Time:</span> <span className="text-[#4b5563]">{timeSlotDisplay[booking.timeSlot]}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">People:</span> <span className="text-[#4b5563]">{booking.people}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Park:</span> <span className="text-[#4b5563] capitalize">{booking.park || 'N/A'}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Guide:</span> <span className="text-[#4b5563]">{booking.guideOption}</span></p>
                    <p className="text-sm"><span className="font-semibold text-[#1f2937]">Meals:</span> <span className="text-[#4b5563]">{booking.mealOption === 'with' ? 'Included' : 'Not Included'}</span></p>
                  </div>
                </div>
              </div>

              {booking.adminNotes && (
                <div className="mb-6 p-4 bg-[#fee000]/20 backdrop-blur-sm border-l-4 border-[#fee000]/60 rounded-xl">
                  <p className="text-sm font-bold text-[#856404] mb-1">📝 Admin Notes:</p>
                  <p className="text-sm text-[#4b5563]">{booking.adminNotes}</p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#e5e7eb]">
                  <button
                    onClick={() => handleApprove(booking._id)}
                    className="flex-1 bg-[#034123] hover:bg-[#026042] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>✓</span> Approve Booking
                  </button>
                  <button
                    onClick={() => handleRejectClick(booking)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>✗</span> Reject Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowRejectModal(false);
          setRejectReason('');
          setSelectedBooking(null);
        }}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-[#034123] mb-4">Reject Booking</h3>
            <p className="text-[#6b7280] mb-6">
              Please provide a reason for rejecting this booking. The customer will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl p-4 mb-6 h-32 focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
              placeholder="Enter rejection reason (optional)..."
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-[#d1d5db]/60"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement;
