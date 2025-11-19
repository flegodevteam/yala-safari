// src/components/DateAvailabilityChecker.jsx

import React, { useState, useEffect } from 'react';
import { publicFetch, apiEndpoints } from '../config/api';

const DateAvailabilityChecker = ({ selectedDate, onAvailabilityCheck }) => {
  const [checking, setChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    } else {
      setAvailabilityStatus(null);
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    if (!selectedDate) return;

    setChecking(true);
    try {
      // ✅ Format date as YYYY-MM-DD
      const dateString = selectedDate instanceof Date 
        ? selectedDate.toISOString().split('T')[0]
        : new Date(selectedDate).toISOString().split('T')[0];
      
      console.log('🔍 Checking date availability:', dateString);

      const response = await publicFetch(
        `${apiEndpoints.bookings.getAll}/check-availability/${dateString}`
      );

      const data = await response.json();
      console.log('📊 Availability response:', data);

      setAvailabilityStatus({
        available: data.available,
        message: data.message,
        booking: data.booking,
      });

      onAvailabilityCheck(data.available);
    } catch (error) {
      console.error('❌ Error checking availability:', error);
      setAvailabilityStatus({
        available: false,
        message: 'Unable to check availability. Please try again.',
      });
      onAvailabilityCheck(false);
    } finally {
      setChecking(false);
    }
  };

  if (!selectedDate) return null;

  if (checking) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-blue-800 font-medium">Checking availability...</p>
        </div>
      </div>
    );
  }

  if (!availabilityStatus) return null;

  if (availabilityStatus.available) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-green-800 font-semibold">Date Available!</p>
            <p className="text-green-700 text-sm">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              is available for booking.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <p className="text-red-800 font-semibold">Date Not Available</p>
          <p className="text-red-700 text-sm mb-2">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            is already booked.
          </p>
          {availabilityStatus.booking && (
            <div className="mt-2 p-3 bg-white rounded border border-red-200">
              <p className="text-xs text-gray-600 mb-1">
                <strong>Booking ID:</strong> {availabilityStatus.booking.bookingId}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <strong>Status:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded font-semibold ${
                    availabilityStatus.booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {availabilityStatus.booking.status.toUpperCase()}
                </span>
              </p>
              <p className="text-xs text-gray-600">
                <strong>Time Slot:</strong> {availabilityStatus.booking.timeSlot}
              </p>
            </div>
          )}
          <p className="text-red-700 text-sm mt-2 font-medium">
            Please choose a different date to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateAvailabilityChecker;