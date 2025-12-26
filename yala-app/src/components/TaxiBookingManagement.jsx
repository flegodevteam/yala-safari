import React, { useState, useEffect } from 'react';
import { adminFetch, API_BASE_URL } from '../config/api';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiMail, FiPhone, FiGlobe, FiCheck } from 'react-icons/fi';

const TaxiBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmingBookingId, setConfirmingBookingId] = useState(null);

  useEffect(() => {
    fetchTaxiBookings();
  }, []);

  const fetchTaxiBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminFetch(`${API_BASE_URL}/api/taxi-bookings`);
      const data = await response.json();
      
      console.log('📊 Fetched taxi bookings:', data);

      if (data.success && data.data) {
        setBookings(data.data);
      } else {
        setError(data.message || 'Failed to fetch taxi bookings');
      }
    } catch (err) {
      console.error('❌ Error fetching taxi bookings:', err);
      setError('Failed to fetch taxi bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || styles.pending
        }`}
      >
        {status?.toUpperCase() || 'PENDING'}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || styles.pending
        }`}
      >
        {status?.toUpperCase() || 'PENDING'}
      </span>
    );
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      setConfirmingBookingId(bookingId);
      setError(null);

      const response = await adminFetch(`${API_BASE_URL}/api/taxi-bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Update the booking in the list
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? data.data : booking
          )
        );

        // Update selected booking if it's the one being confirmed
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(data.data);
        }

        console.log('✅ Booking confirmed successfully:', data);
      } else {
        setError(data.message || 'Failed to confirm booking');
      }
    } catch (err) {
      console.error('❌ Error confirming booking:', err);
      setError('Failed to confirm booking. Please try again later.');
    } finally {
      setConfirmingBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading taxi bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTaxiBookings}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Taxi Bookings</h1>
            <p className="text-gray-600 mt-1">Manage and view all taxi bookings</p>
          </div>
          <button
            onClick={fetchTaxiBookings}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2"
          >
            <FiClock className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passengers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No taxi bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.bookingReference || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerDetails?.firstName} {booking.customerDetails?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FiMail className="h-3 w-3" />
                        {booking.customerDetails?.email}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <FiPhone className="h-3 w-3" />
                        {booking.customerDetails?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.taxi?.vehicleName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.taxi?.vehicleType || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <FiMapPin className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">From:</span> {booking.tripDetails?.pickupLocation}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <FiMapPin className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">To:</span> {booking.tripDetails?.dropoffLocation}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 md:hidden">
                          <FiCalendar className="h-3 w-3" />
                          {formatDate(booking.tripDetails?.pickupDate)} at {formatTime(booking.tripDetails?.pickupTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <FiCalendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{formatDate(booking.tripDetails?.pickupDate)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(booking.tripDetails?.pickupTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                      <FiUsers className="h-4 w-4" />
                        <div className="flex items-center gap-1">
                      
                          Adults: {booking.passengers?.adults || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          Children: {booking.passengers?.children || 0}
                        </div>
                        <div className="text-xs text-gray-500">
                          Luggage: {booking.passengers?.luggage || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.pricing?.currency || 'USD'} {booking.pricing?.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.tripDetails?.serviceType || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(booking.bookingStatus)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col items-start gap-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          View Details
                        </button>
                        {booking.bookingStatus === 'pending' && (
                          <button
                            onClick={() => handleConfirmBooking(booking._id)}
                            disabled={confirmingBookingId === booking._id}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                 
                            {confirmingBookingId === booking._id ? 'Confirming...' : 'Confirm'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Reference */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {selectedBooking.bookingReference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="text-sm font-medium text-gray-800">{selectedBooking._id}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.customerDetails?.firstName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.customerDetails?.lastName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiMail className="h-4 w-4" /> Email
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.customerDetails?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiPhone className="h-4 w-4" /> Phone
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.customerDetails?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiGlobe className="h-4 w-4" /> Country
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.customerDetails?.country || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.tripDetails?.serviceType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" /> Pickup Location
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.tripDetails?.pickupLocation || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" /> Dropoff Location
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedBooking.tripDetails?.dropoffLocation || 'N/A'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" /> Pickup Date & Time
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedBooking.tripDetails?.pickupDate)} at {formatTime(selectedBooking.tripDetails?.pickupTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance & Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBooking.tripDetails?.distance || 0} km / {selectedBooking.tripDetails?.duration || 0} hrs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              {selectedBooking.taxi && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBooking.taxi.vehicleName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBooking.taxi.vehicleType || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedBooking.taxi.capacity?.passengers || 0} passengers, {selectedBooking.taxi.capacity?.luggage || 0} luggage
                      </p>
                    </div>
                    {selectedBooking.taxi.driverInfo && (
                      <div>
                        <p className="text-sm text-gray-600">Driver Experience</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedBooking.taxi.driverInfo.experience || 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedBooking.taxi.features && selectedBooking.taxi.features.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.taxi.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Passengers */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Passengers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Adults</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedBooking.passengers?.adults || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Children</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedBooking.passengers?.children || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Luggage</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedBooking.passengers?.luggage || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {selectedBooking.pricing && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Price</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBooking.pricing.currency || 'USD'} {selectedBooking.pricing.basePrice?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Distance Charge</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBooking.pricing.currency || 'USD'} {selectedBooking.pricing.distanceCharge?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Additional Charges</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedBooking.pricing.currency || 'USD'} {selectedBooking.pricing.additionalCharges?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-lg font-bold text-amber-600">
                          {selectedBooking.pricing.currency || 'USD'} {selectedBooking.pricing.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(selectedBooking.specialRequests || selectedBooking.notes) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                  {selectedBooking.specialRequests && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Booking Status</p>
                    {getStatusBadge(selectedBooking.bookingStatus)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Created: {formatDate(selectedBooking.createdAt)}</p>
                  <p>Updated: {formatDate(selectedBooking.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              {selectedBooking.bookingStatus === 'pending' && (
                <button
                  onClick={() => handleConfirmBooking(selectedBooking._id)}
                  disabled={confirmingBookingId === selectedBooking._id}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  {confirmingBookingId === selectedBooking._id ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiBookingManagement;

