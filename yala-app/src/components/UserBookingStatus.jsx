import React, { useState } from 'react';
import { publicFetch, apiEndpoints } from '../config/api';
import { FaSearch } from 'react-icons/fa';

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
          color: 'bg-[#fee000]/20 backdrop-blur-sm text-[#856404] border-[#fee000]/40',
          icon: '⏳',
          message: 'Your booking is pending admin confirmation. You will receive an email once it\'s confirmed.',
        };
      case 'confirmed':
        return {
          color: 'bg-[#034123]/20 backdrop-blur-sm text-[#034123] border-[#034123]/40',
          icon: '✅',
          message: 'Your booking is confirmed! We look forward to your visit.',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100/80 backdrop-blur-sm text-red-800 border-red-300/60',
          icon: '❌',
          message: 'This booking has been cancelled.',
        };
      case 'completed':
        return {
          color: 'bg-blue-100/80 backdrop-blur-sm text-blue-800 border-blue-300/60',
          icon: '✓',
          message: 'This booking has been completed. Thank you for choosing us!',
        };
      default:
        return {
          color: 'bg-gray-100/80 backdrop-blur-sm text-gray-800 border-gray-300/60',
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
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-[#034123]/10 backdrop-blur-md text-[#034123] text-xs font-semibold rounded-full border border-[#034123]/20 shadow-md mb-4">
            BOOKING TRACKER
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#034123] mb-3">Check Your Booking Status</h1>
          <p className="text-[#4b5563] text-lg">Track your safari booking in real-time</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#034123] mb-3">
              Search by:
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSearchMethod('email')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                  searchMethod === 'email'
                    ? 'bg-[#f26b21] text-white shadow-lg scale-105'
                    : 'bg-[#e6e6e6] text-[#333333] hover:bg-[#034123]/5 hover:border-[#034123]/20 border border-transparent'
                }`}
              >
                 Email Address
              </button>
              {/* <button
                type="button"
                onClick={() => setSearchMethod('booking')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                  searchMethod === 'booking'
                    ? 'bg-[#f26b21] text-white shadow-lg scale-105'
                    : 'bg-[#e6e6e6] text-[#333333] hover:bg-[#034123]/5 hover:border-[#034123]/20 border border-transparent'
                }`}
              >
                🎫 Booking ID
              </button> */}
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="mb-5">
              <input
                type={searchMethod === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchMethod === 'email'
                    ? 'Enter your email address'
                    : 'Enter your booking ID (e.g., YALA-xxxxx)'
                }
                className="w-full px-4 py-3.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 placeholder-[#9ca3af] text-[#1f2937] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f26b21]/50 focus:border-[#f26b21] transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f26b21] hover:bg-[#e05a1a] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch className="w-5 h-5" /> Check Status
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50/80 backdrop-blur-sm border-2 border-red-300/60 text-red-700 rounded-xl text-sm font-medium shadow-md">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && bookings.length === 0 && !error && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-10 lg:p-12 text-center">
            <div className="text-6xl mb-6 "><FaSearch className="w-20 h-20 text-center mx-auto" /></div>
            <h3 className="text-2xl font-bold text-[#034123] mb-3">No Bookings Found</h3>
            <p className="text-[#4b5563] text-base">
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
                <div key={booking._id} className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-3xl">
                  {/* Status Banner */}
                  <div className={`p-5 lg:p-6 border-l-4 ${statusInfo.color} backdrop-blur-sm`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{statusInfo.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-[#034123] mb-1">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </h3>
                        <p className="text-sm text-[#4b5563]">{statusInfo.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-[#e5e7eb]">
                      <div>
                        <h4 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2">{booking.bookingId}</h4>
                        <p className="text-sm text-[#6b7280]">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-3xl lg:text-4xl font-bold text-[#f26b21] mb-1">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-[#6b7280] font-medium">Total Amount</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-6">
                      <div className="space-y-3 bg-[#f9fafb]/50 backdrop-blur-sm p-5 rounded-xl border border-[#e5e7eb]/60">
                        <h5 className="font-bold text-[#034123] text-base border-b border-[#034123]/20 pb-2 mb-3">Safari Details</h5>
                        <div className="space-y-2.5">
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Date:</span>{' '}
                            <span className="text-[#4b5563]">{formatDate(booking.date)}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Time:</span>{' '}
                            <span className="text-[#4b5563]">{timeSlotDisplay[booking.timeSlot]}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">People:</span>{' '}
                            <span className="text-[#4b5563]">{booking.people}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Park:</span>{' '}
                            <span className="text-[#4b5563] capitalize">{booking.park || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 bg-[#f9fafb]/50 backdrop-blur-sm p-5 rounded-xl border border-[#e5e7eb]/60">
                        <h5 className="font-bold text-[#034123] text-base border-b border-[#034123]/20 pb-2 mb-3">Customer Info</h5>
                        <div className="space-y-2.5">
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Name:</span>{' '}
                            <span className="text-[#4b5563]">{booking.customerName}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Email:</span>{' '}
                            <span className="text-[#4b5563]">{booking.customerEmail}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Phone:</span>{' '}
                            <span className="text-[#4b5563]">{booking.customerPhone}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-[#1f2937]">Payment:</span>{' '}
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm shadow-sm ${
                              booking.paymentStatus === 'paid' 
                                ? 'bg-[#034123]/20 text-[#034123] border border-[#034123]/30' :
                              booking.paymentStatus === 'pending' 
                                ? 'bg-[#fee000]/30 text-[#856404] border border-[#fee000]/40' :
                              'bg-red-100/80 text-red-800 border border-red-300/60'
                            }`}>
                              {booking.paymentStatus.toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.adminNotes && (
                      <div className="mt-5 p-4 bg-[#fee000]/20 backdrop-blur-sm border-l-4 border-[#fee000]/60 rounded-xl">
                        <p className="text-sm font-bold text-[#856404] mb-2">📝 Admin Notes:</p>
                        <p className="text-sm text-[#4b5563] leading-relaxed">{booking.adminNotes}</p>
                      </div>
                    )}

                    {booking.status === 'pending' && (
                      <div className="mt-6 p-5 bg-[#034123]/5 backdrop-blur-sm border border-[#034123]/20 rounded-xl">
                        <h5 className="font-bold text-[#034123] mb-3 text-base">📞 What's Next?</h5>
                        <ul className="text-sm text-[#4b5563] space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-[#034123] mt-0.5">•</span>
                            <span>Our team is reviewing your booking request</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#034123] mt-0.5">•</span>
                            <span>You will receive a confirmation email within 24 hours</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#034123] mt-0.5">•</span>
                            <span>Please keep your booking ID for reference</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#034123] mt-0.5">•</span>
                            <span>For urgent queries, contact us via WhatsApp</span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                      <div className="mt-6 p-5 bg-[#034123]/10 backdrop-blur-sm border border-[#034123]/30 rounded-xl">
                        <h5 className="font-bold text-[#034123] mb-2 text-base">💳 Payment Required</h5>
                        <p className="text-sm text-[#4b5563] leading-relaxed">
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
        <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 text-center">
          <h3 className="font-bold text-[#034123] text-xl mb-3">Need Help?</h3>
          <p className="text-[#4b5563] text-sm mb-6">
            If you have any questions about your booking, please contact us:
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a 
              href="mailto:info@yalasafari.com" 
              className="px-5 py-2.5 bg-[#034123] hover:bg-[#026042] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
               Email Us
            </a>
            <a 
              href="https://wa.me/94773742700" 
              className="px-5 py-2.5 bg-[#f26b21] hover:bg-[#e05a1a] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookingStatus;