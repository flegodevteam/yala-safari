// services/AvailabilityService.js
import Availability from '../models/Availability.js';
import Safari from '../models/Safari.js';
import Jeep from '../models/Jeep.js';
import Driver from '../models/Driver.js';
import AppError from '../utils/AppError.js';

class AvailabilityService {
  /**
   * Get availability for a specific safari and date range
   */
  async getAvailability(safariId, startDate, endDate, bookingType = 'all') {
    const safari = await Safari.findById(safariId);
    if (!safari) {
      throw new AppError('Safari not found', 404);
    }

    const dateQuery = {
      safari: safariId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const availabilities = await Availability.find(dateQuery)
      .populate('jeeps.jeep')
      .populate('jeeps.driver');

    // Process availability based on booking type
    const processedAvailabilities = availabilities.map(avail => {
      const availDate = avail.toObject();
      
      if (bookingType === 'private') {
        availDate.availableJeeps = this.getAvailablePrivateJeeps(availDate);
      } else if (bookingType === 'shared') {
        availDate.sharedAvailability = this.getSharedAvailability(availDate);
      } else {
        availDate.availableJeeps = this.getAvailablePrivateJeeps(availDate);
        availDate.sharedAvailability = this.getSharedAvailability(availDate);
      }

      return availDate;
    });

    // Fill in missing dates with full availability
    const allDates = this.generateDateRange(startDate, endDate);
    const existingDates = processedAvailabilities.map(a => 
      a.date.toISOString().split('T')[0]
    );
    
    for (const date of allDates) {
      if (!existingDates.includes(date)) {
        processedAvailabilities.push(
          await this.generateFullAvailability(safariId, date)
        );
      }
    }

    return processedAvailabilities.sort((a, b) => a.date - b.date);
  }

  /**
   * Get available private jeeps
   */
  getAvailablePrivateJeeps(availability) {
    return availability.jeeps.filter(j => 
      j.status === 'available' && 
      (!j.bookings || j.bookings.length === 0)
    ).map(j => ({
      jeep: j.jeep,
      driver: j.driver,
      type: j.jeep.type,
      capacity: j.jeep.capacity,
      pricing: j.jeep.pricing
    }));
  }

  /**
   * Get shared availability
   */
  getSharedAvailability(availability) {
    const sharedJeeps = availability.jeeps.filter(j => 
      j.sharedSeats && j.sharedSeats.available > 0
    );

    return {
      totalSeatsAvailable: sharedJeeps.reduce((sum, j) => 
        sum + j.sharedSeats.available, 0
      ),
      jeeps: sharedJeeps.map(j => ({
        jeepId: j.jeep._id,
        availableSeats: j.sharedSeats.available,
        bookedSeats: j.sharedSeats.booked
      }))
    };
  }

  /**
   * Generate date range
   */
  generateDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Generate full availability for a date
   */
  async generateFullAvailability(safariId, date) {
    const safari = await Safari.findById(safariId);
    const jeeps = await Jeep.find({ active: true, status: 'available' })
      .populate('driver');

    return {
      safari: safariId,
      date: new Date(date),
      availableJeeps: jeeps.map(j => ({
        jeep: j,
        driver: j.driver,
        type: j.type,
        capacity: j.capacity,
        pricing: j.pricing
      })),
      sharedAvailability: {
        totalSeatsAvailable: jeeps.reduce((sum, j) => sum + j.capacity, 0),
        jeeps: []
      },
      slots: safari.timeSlots.map(slot => ({
        timeSlot: slot,
        totalCapacity: slot.maxCapacity,
        availableCapacity: slot.maxCapacity,
        status: 'available'
      }))
    };
  }

  /**
   * Block dates for maintenance or special events
   */
  async blockDates(safariId, dates, reason) {
    const blockedDates = [];
    
    for (const date of dates) {
      let availability = await Availability.findOne({
        safari: safariId,
        date: new Date(date)
      });

      if (!availability) {
        availability = new Availability({
          safari: safariId,
          date: new Date(date),
          jeeps: [],
          slots: [],
          specialConditions: {
            parkClosure: true,
            specialEvent: reason
          }
        });
      } else {
        availability.specialConditions = {
          parkClosure: true,
          specialEvent: reason
        };
        availability.jeeps = [];
        availability.slots = [];
      }

      await availability.save();
      blockedDates.push(availability);
    }

    return blockedDates;
  }

  /**
   * Update pricing multiplier for specific dates
   */
  async updatePricingMultiplier(safariId, dates, multiplier, reason) {
    const updates = [];
    
    for (const date of dates) {
      const availability = await Availability.findOneAndUpdate(
        { safari: safariId, date: new Date(date) },
        {
          'pricing.multiplier': multiplier,
          'pricing.reason': reason
        },
        { new: true, upsert: true }
      );
      
      updates.push(availability);
    }

    return updates;
  }
}

export default new AvailabilityService();