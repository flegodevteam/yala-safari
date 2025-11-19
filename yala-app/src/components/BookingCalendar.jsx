import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'https://squid-app-qwyej.ondigitalocean.app';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchBookedDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const fetchBookedDates = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      console.log('🔍 Fetching booked dates:', {
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });

      const response = await axios.get(`${API_URL}/bookings/booked-dates`, {
        params: {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString(),
        },
      });

      console.log('✅ Received booked dates:', response.data);
      setBookedDates(response.data.bookedDates || []);
    } catch (error) {
      console.error('❌ Error fetching booked dates:', error.response?.data || error.message);
      setBookedDates([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateBooked = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return bookedDates.find(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === dateToCheck.getTime();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#fee000]';
      case 'confirmed':
        return 'bg-[#034123]';
      default:
        return 'bg-gray-500';
    }
  };

  const timeSlotDisplay = {
    morning: 'Morning (5:30 AM)',
    afternoon: 'Afternoon (2:30 PM)',
    extended: 'Extended (5:30 AM)',
    fullDay: 'Full Day'
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#e5e7eb]">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2">Booking Calendar</h2>
        <p className="text-[#6b7280] text-sm lg:text-base">View booked and pending dates</p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2.5 hover:bg-[#034123]/10 rounded-xl transition-all duration-300 text-[#034123] hover:scale-110"
          aria-label="Previous month"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg lg:text-xl font-bold text-[#034123]">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2.5 hover:bg-[#034123]/10 rounded-xl transition-all duration-300 text-[#034123] hover:scale-110"
          aria-label="Next month"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 lg:gap-6 mb-6 text-sm bg-[#f9fafb]/50 backdrop-blur-sm p-3 rounded-xl border border-[#e5e7eb]/60">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#fee000] shadow-sm"></div>
          <span className="font-medium text-[#856404]">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#034123] shadow-sm"></div>
          <span className="font-medium text-[#034123]">Confirmed</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#034123] mx-auto mb-4"></div>
          <p className="text-[#6b7280] font-medium">Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center font-bold text-[#034123] text-xs lg:text-sm py-2 bg-[#034123]/5 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square"></div>;
              }

              const booking = isDateBooked(day);
              const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => booking && setSelectedDate(booking)}
                  className={`
                    aspect-square flex items-center justify-center rounded-xl relative
                    ${isToday ? 'ring-2 ring-[#f26b21] bg-[#f26b21]/10' : ''}
                    ${booking ? 'cursor-pointer hover:scale-105' : 'hover:bg-[#f9fafb]'}
                    ${booking ? booking.status === 'pending' ? 'bg-[#fee000]/20' : 'bg-[#034123]/10' : 'bg-white/50'}
                    transition-all duration-300 border border-transparent hover:border-[#034123]/20
                  `}
                >
                  <span className={`text-sm lg:text-base font-medium ${booking ? 'font-bold text-[#034123]' : 'text-[#4b5563]'} ${isToday ? 'text-[#f26b21] font-bold' : ''}`}>
                    {day}
                  </span>
                  {booking && (
                    <div
                      className={`absolute bottom-1.5 w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full ${getStatusColor(booking.status)} shadow-sm`}
                      title={`${booking.status} - ${booking.bookingId}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Selected Date Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDate(null)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-[#034123] mb-6">Booking Details</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-4 rounded-xl border border-[#e5e7eb]/60">
                <p className="text-sm font-semibold text-[#6b7280] mb-1">Booking ID</p>
                <p className="text-base font-bold text-[#034123]">{selectedDate.bookingId}</p>
              </div>
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-4 rounded-xl border border-[#e5e7eb]/60">
                <p className="text-sm font-semibold text-[#6b7280] mb-1">Date</p>
                <p className="text-base text-[#1f2937]">{new Date(selectedDate.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-4 rounded-xl border border-[#e5e7eb]/60">
                <p className="text-sm font-semibold text-[#6b7280] mb-1">Time Slot</p>
                <p className="text-base text-[#1f2937]">{timeSlotDisplay[selectedDate.timeSlot] || selectedDate.timeSlot}</p>
              </div>
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm p-4 rounded-xl border border-[#e5e7eb]/60">
                <p className="text-sm font-semibold text-[#6b7280] mb-2">Status</p>
                <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold ${
                  selectedDate.status === 'pending' 
                    ? 'bg-[#fee000]/20 text-[#856404] border border-[#fee000]/40' :
                  selectedDate.status === 'confirmed' 
                    ? 'bg-[#034123]/20 text-[#034123] border border-[#034123]/40' :
                  'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                  {selectedDate.status.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="w-full bg-[#f26b21] hover:bg-[#e05a1a] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Today Button */}
      <button
        onClick={() => setCurrentDate(new Date())}
        className="mt-6 w-full bg-[#034123]/10 hover:bg-[#034123]/20 text-[#034123] font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-[#034123]/20 hover:border-[#034123]/40 shadow-sm hover:shadow-md"
      >
        Go to Today
      </button>
    </div>
  );
};

export default BookingCalendar;