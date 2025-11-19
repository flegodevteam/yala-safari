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
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-green-500';
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Calendar</h2>
        <p className="text-gray-600 text-sm">View booked and pending dates</p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Confirmed</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
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
                    aspect-square flex items-center justify-center rounded-lg relative
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${booking ? 'cursor-pointer hover:opacity-80' : ''}
                    ${booking ? 'bg-gray-50' : 'hover:bg-gray-100'}
                    transition-all
                  `}
                >
                  <span className={`text-sm ${booking ? 'font-semibold' : ''}`}>{day}</span>
                  {booking && (
                    <div
                      className={`absolute bottom-1 w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDate(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <div className="space-y-2 mb-4">
              <p><strong>Booking ID:</strong> {selectedDate.bookingId}</p>
              <p><strong>Date:</strong> {new Date(selectedDate.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time Slot:</strong> {timeSlotDisplay[selectedDate.timeSlot] || selectedDate.timeSlot}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  selectedDate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedDate.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDate.status.toUpperCase()}
                </span>
              </p>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Today Button */}
      <button
        onClick={() => setCurrentDate(new Date())}
        className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
      >
        Today
      </button>
    </div>
  );
};

export default BookingCalendar;