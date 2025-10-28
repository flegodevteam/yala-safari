// services/BookingService.js
import Booking from '../models/Booking.js';
import Availability from '../models/Availability.js';
import Safari from '../models/Safari.js';
import Jeep from '../models/Jeep.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendBookingConfirmation, sendBookingCancellation } from '../utils/emailService.js';
import { calculatePricing } from '../utils/pricingCalculator.js';
import { validateBookingData } from '../validators/bookingValidator.js';
import AppError from '../utils/AppError.js';

class BookingService {
  /**
   * Create a new booking with transaction support
   */
  async createBooking(bookingData, userId = null) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Validate booking data
      const validationError = validateBookingData(bookingData);
      if (validationError) {
        throw new AppError(validationError, 400);
      }

      // Check safari availability
      const safari = await Safari.findById(bookingData.safariId).session(session);
      if (!safari || !safari.active) {
        throw new AppError('Safari not available', 404);
      }

      // Check and update availability
      const availability = await this.checkAndUpdateAvailability(
        bookingData, 
        session
      );

      // Calculate pricing
      const pricing = await calculatePricing(bookingData, safari);

      // Create booking
      const booking = new Booking({
        customer: userId,
        guestDetails: !userId ? bookingData.guestDetails : undefined,
        safari: bookingData.safariId,
        bookingType: bookingData.bookingType,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        participants: bookingData.participants,
        extras: bookingData.extras,
        pickup: bookingData.pickup,
        pricing,
        payment: {
          method: bookingData.paymentMethod,
          status: 'pending'
        },
        source: bookingData.source || 'website'
      });

      // Handle private booking
      if (bookingData.bookingType === 'private') {
        booking.jeep = availability.assignedJeep;
      } 
      // Handle shared booking
      else {
        booking.sharedBookingDetails = {
          requestedSeats: bookingData.participants.totalCount,
          assignedSeats: availability.assignedSeats,
          sharedJeep: availability.assignedJeep
        };
      }

      await booking.save({ session });

      // Update availability document
      await Availability.findByIdAndUpdate(
        availability._id,
        {
          $push: { 'jeeps.$[elem].bookings': booking._id },
          $inc: { 'slots.$[slot].bookedCapacity': bookingData.participants.totalCount }
        },
        {
          arrayFilters: [
            { 'elem.jeep': availability.assignedJeep },
            { 'slot.timeSlot.startTime': bookingData.timeSlot.startTime }
          ],
          session
        }
      );

      await session.commitTransaction();

      // Send confirmation email (async, don't wait)
      if (booking.guestDetails?.email || userId) {
        this.sendConfirmationEmail(booking._id).catch(console.error);
      }

      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Check and update availability
   */
  async checkAndUpdateAvailability(bookingData, session) {
    const { safariId, date, bookingType, participants, jeepType } = bookingData;
    
    // Find or create availability document
    let availability = await Availability.findOne({
      safari: safariId,
      date: date
    }).session(session);

    if (!availability) {
      availability = await this.createAvailabilityDocument(
        safariId, 
        date, 
        session
      );
    }

    // For private booking
    if (bookingType === 'private') {
      const availableJeep = await this.findAvailableJeep(
        jeepType, 
        date, 
        bookingData.timeSlot,
        session
      );
      
      if (!availableJeep) {
        throw new AppError('No jeeps available for selected date and time', 400);
      }

      return {
        _id: availability._id,
        assignedJeep: availableJeep._id
      };
    } 
    // For shared booking
    else {
      const sharedJeep = await this.findOrAssignSharedJeep(
        availability,
        participants.totalCount,
        bookingData.timeSlot,
        session
      );

      if (!sharedJeep) {
        throw new AppError('No shared seats available', 400);
      }

      return {
        _id: availability._id,
        assignedJeep: sharedJeep.jeepId,
        assignedSeats: sharedJeep.seats
      };
    }
  }

  /**
   * Find available jeep for private booking
   */
  async findAvailableJeep(jeepType, date, timeSlot, session) {
    const jeeps = await Jeep.find({
      type: jeepType,
      status: 'available',
      active: true
    }).session(session);

    for (const jeep of jeeps) {
      const isBooked = await Booking.findOne({
        jeep: jeep._id,
        date,
        status: { $nin: ['cancelled', 'refunded'] },
        'timeSlot.startTime': timeSlot.startTime
      }).session(session);

      if (!isBooked) {
        return jeep;
      }
    }

    return null;
  }

  /**
   * Find or assign shared jeep
   */
  async findOrAssignSharedJeep(availability, requestedSeats, timeSlot, session) {
    // Look for existing shared jeep with available seats
    for (const jeepSlot of availability.jeeps) {
      if (jeepSlot.sharedSeats) {
        const availableSeats = jeepSlot.sharedSeats.total - jeepSlot.sharedSeats.booked.length;
        if (availableSeats >= requestedSeats) {
          const seats = [];
          for (let i = 1; i <= jeepSlot.sharedSeats.total; i++) {
            if (!jeepSlot.sharedSeats.booked.includes(i) && seats.length < requestedSeats) {
              seats.push(i);
            }
          }
          return { jeepId: jeepSlot.jeep, seats };
        }
      }
    }

    // Assign new jeep for shared booking
    const newJeep = await this.findAvailableJeep('basic', availability.date, timeSlot, session);
    if (newJeep) {
      // Add to availability document
      availability.jeeps.push({
        jeep: newJeep._id,
        status: 'available',
        sharedSeats: {
          total: newJeep.capacity,
          available: newJeep.capacity - requestedSeats,
          booked: Array.from({ length: requestedSeats }, (_, i) => i + 1)
        }
      });
      await availability.save({ session });
      
      return { 
        jeepId: newJeep._id, 
        seats: Array.from({ length: requestedSeats }, (_, i) => i + 1)
      };
    }

    return null;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, userId, reason) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findById(bookingId).session(session);
      
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status === 'cancelled') {
        throw new AppError('Booking already cancelled', 400);
      }

      // Check cancellation policy
      const refundAmount = await this.calculateRefundAmount(booking);

      // Update booking status
      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledAt: new Date(),
        cancelledBy: userId,
        reason,
        refundAmount,
        refundStatus: refundAmount > 0 ? 'pending' : 'not-applicable'
      };

      await booking.save({ session });

      // Release the jeep/seats
      await this.releaseBookedResources(booking, session);

      // Process refund if applicable
      if (refundAmount > 0) {
        await this.processRefund(booking, refundAmount, session);
      }

      await session.commitTransaction();

      // Send cancellation email
      this.sendCancellationEmail(booking._id).catch(console.error);

      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Calculate refund amount based on cancellation policy
   */
  async calculateRefundAmount(booking) {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const hoursUntilTrip = (bookingDate - now) / (1000 * 60 * 60);

    // Cancellation policy
    if (hoursUntilTrip > 48) {
      return booking.pricing.total * 0.9; // 90% refund
    } else if (hoursUntilTrip > 24) {
      return booking.pricing.total * 0.5; // 50% refund
    } else {
      return 0; // No refund
    }
  }

  /**
   * Get booking by ID with populated fields
   */
  async getBookingById(bookingId, userId = null) {
    const query = { _id: bookingId };
    
    // If not admin, verify ownership
    if (userId && !await this.isAdmin(userId)) {
      query.customer = userId;
    }

    const booking = await Booking.findOne(query)
      .populate('safari')
      .populate('jeep')
      .populate('customer', 'profile email')
      .populate('sharedBookingDetails.sharedJeep');

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return booking;
  }

  /**
   * Get user bookings with pagination
   */
  async getUserBookings(userId, page = 1, limit = 10, status = null) {
    const query = { customer: userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('safari')
        .populate('jeep')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query)
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status, userId) {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['completed', 'cancelled', 'no-show'],
      'completed': [],
      'cancelled': [],
      'no-show': [],
      'refunded': []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      throw new AppError(`Invalid status transition from ${booking.status} to ${status}`, 400);
    }

    booking.status = status;
    booking.audit.modifiedBy.push({
      user: userId,
      modifiedAt: new Date(),
      changes: `Status changed to ${status}`
    });

    await booking.save();

    return booking;
  }

  /**
   * Send confirmation email
   */
  async sendConfirmationEmail(bookingId) {
    const booking = await this.getBookingById(bookingId);
    await sendBookingConfirmation(booking);
  }

  /**
   * Send cancellation email
   */
  async sendCancellationEmail(bookingId) {
    const booking = await this.getBookingById(bookingId);
    await sendBookingCancellation(booking);
  }

  /**
   * Create availability document for a specific date
   */
  async createAvailabilityDocument(safariId, date, session) {
    const safari = await Safari.findById(safariId).session(session);
    const jeeps = await Jeep.find({ active: true, status: 'available' }).session(session);
    
    const availability = new Availability({
      safari: safariId,
      date,
      jeeps: jeeps.map(jeep => ({
        jeep: jeep._id,
        status: 'available',
        bookings: []
      })),
      slots: safari.timeSlots.map(slot => ({
        timeSlot: {
          startTime: slot.startTime,
          endTime: slot.endTime
        },
        totalCapacity: slot.maxCapacity,
        bookedCapacity: 0,
        availableCapacity: slot.maxCapacity,
        status: 'available'
      }))
    });

    await availability.save({ session });
    return availability;
  }

  /**
   * Release booked resources when cancelling
   */
  async releaseBookedResources(booking, session) {
    await Availability.findOneAndUpdate(
      { safari: booking.safari, date: booking.date },
      {
        $pull: { 'jeeps.$[elem].bookings': booking._id },
        $inc: { 'slots.$[slot].bookedCapacity': -booking.participants.totalCount }
      },
      {
        arrayFilters: [
          { 'elem.jeep': booking.jeep || booking.sharedBookingDetails?.sharedJeep },
          { 'slot.timeSlot.startTime': booking.timeSlot.startTime }
        ],
        session
      }
    );

    // For shared bookings, release specific seats
    if (booking.bookingType === 'shared' && booking.sharedBookingDetails?.assignedSeats) {
      await Availability.findOneAndUpdate(
        { 
          safari: booking.safari, 
          date: booking.date,
          'jeeps.jeep': booking.sharedBookingDetails.sharedJeep
        },
        {
          $pullAll: { 'jeeps.$.sharedSeats.booked': booking.sharedBookingDetails.assignedSeats },
          $inc: { 'jeeps.$.sharedSeats.available': booking.sharedBookingDetails.assignedSeats.length }
        },
        { session }
      );
    }
  }

  /**
   * Process refund
   */
  async processRefund(booking, amount, session) {
    // This would integrate with payment gateway
    // For now, just mark as pending refund
    booking.payment.status = 'refunded';
    booking.payment.transactions.push({
      transactionId: `REFUND-${booking.bookingNumber}`,
      amount: -amount,
      method: 'refund',
      date: new Date(),
      status: 'pending',
      reference: `Cancellation refund for ${booking.bookingNumber}`
    });
    
    await booking.save({ session });
  }

  /**
   * Check if user is admin
   */
  async isAdmin(userId) {
    const user = await User.findById(userId);
    return user?.role === 'admin' || user?.role === 'super-admin';
  }
}

export default new BookingService();