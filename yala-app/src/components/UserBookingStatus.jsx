import React, { useState } from 'react';
import { publicFetch, apiEndpoints } from '../config/api';

const UserBookingStatus = () => {
  const [searchMethod, setSearchMethod] = useState('email');
  const [searchValue, setSearchValue] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      let response;
      
      if (searchMethod === 'email') {
        // ✅ Use the API endpoints from config
        const url = `${apiEndpoints.bookings.getAll}/user?email=${encodeURIComponent(searchValue)}`;
        console.log('🔍 Fetching bookings from:', url);
        
        response = await publicFetch(url);
        const data = await response.json();
        console.log('📊 Response:', data);
        
        setBookings(data.bookings || []);
      } else {
        // Search by booking ID
        console.log('🔍 Fetching booking by ID:', searchValue);
        response = await publicFetch(`${apiEndpoints.bookings.getAll}/${searchValue}`);
        const data = await response.json();
        console.log('📊 Response:', data);
        
        if (data.booking) {
          setBookings([data.booking]);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Booking not found. Please check your information and try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: '⏳',
          message: 'Your booking is pending admin confirmation. You will receive an email once it\'s confirmed.',
        };
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: '✅',
          message: 'Your booking is confirmed! We look forward to your visit.',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: '❌',
          message: 'This booking has been cancelled.',
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: '✓',
          message: 'This booking has been completed. Thank you for choosing us!',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: '?',
          message: 'Status unknown',
        };
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Check Your Booking Status</h1>
          <p className="text-gray-600">Track your safari booking in real-time</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by:
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setSearchMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  searchMethod === 'email'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📧 Email Address
              </button>
              <button
                onClick={() => setSearchMethod('booking')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  searchMethod === 'booking'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🎫 Booking ID
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <input
                type={searchMethod === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchMethod === 'email'
                    ? 'Enter your email address'
                    : 'Enter your booking ID (e.g., YALA-xxxxx)'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : '🔍 Check Status'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && bookings.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600">
              {searchMethod === 'email'
                ? 'No bookings found with this email address.'
                : 'No booking found with this ID.'}
            </p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Status Banner */}
                  <div className={`p-4 border-l-4 ${statusInfo.color}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{statusInfo.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </h3>
                        <p className="text-sm">{statusInfo.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">{booking.bookingId}</h4>
                        <p className="text-sm text-gray-500">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-600">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total Amount</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-2">
                        <h5 className="font-semibold text-gray-700 border-b pb-2">Safari Details</h5>
                        <p className="text-sm">
                          <span className="font-semibold">Date:</span> {formatDate(booking.date)}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Time:</span> {timeSlotDisplay[booking.timeSlot]}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">People:</span> {booking.people}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Park:</span>{' '}
                          <span className="capitalize">{booking.park || 'N/A'}</span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-semibold text-gray-700 border-b pb-2">Customer Info</h5>
                        <p className="text-sm">
                          <span className="font-semibold">Name:</span> {booking.customerName}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Email:</span> {booking.customerEmail}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Phone:</span> {booking.customerPhone}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Payment:</span>{' '}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.paymentStatus.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    {booking.adminNotes && (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-600">{booking.adminNotes}</p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">📞 What's Next?</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Our team is reviewing your booking request</li>
                          <li>• You will receive a confirmation email within 24 hours</li>
                          <li>• Please keep your booking ID for reference</li>
                          <li>• For urgent queries, contact us via WhatsApp</li>
                        </ul>
                      </div>
                    )}

                    {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">💳 Payment Required</h5>
                        <p className="text-sm text-green-800">
                          Your booking is confirmed! Our team will contact you shortly with payment details.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            If you have any questions about your booking, please contact us:
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="mailto:contact@yalasafari.com" className="text-orange-600 hover:underline">
              📧 Email Us
            </a>
            <a href="https://wa.me/94773742700" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookingStatus;