// controllers/BookingController.js
import BookingService from '../services/BookingService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { validateBookingInput } from '../validators/bookingValidator.js';

class BookingController {
  /**
   * Create new booking
   * POST /api/bookings
   */
  createBooking = catchAsync(async (req, res, next) => {
    // Validate input
    const validation = validateBookingInput(req.body);
    if (!validation.valid) {
      return next(new AppError(validation.error, 400));
    }

    // Create booking
    const booking = await BookingService.createBooking(
      req.body,
      req.user?._id
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        bookingNumber: booking.bookingNumber
      }
    });
  });

  /**
   * Get booking by ID
   * GET /api/bookings/:id
   */
  getBooking = catchAsync(async (req, res, next) => {
    const booking = await BookingService.getBookingById(
      req.params.id,
      req.user?._id
    );

    res.json({
      success: true,
      data: { booking }
    });
  });

  /**
   * Get user bookings
   * GET /api/bookings/my-bookings
   */
  getUserBookings = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await BookingService.getUserBookings(
      req.user._id,
      parseInt(page),
      parseInt(limit),
      status
    );

    res.json({
      success: true,
      data: result
    });
  });

  /**
   * Update booking status
   * PATCH /api/bookings/:id/status
   */
  updateBookingStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError('Status is required', 400));
    }

    const booking = await BookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user._id
    );

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: { booking }
    });
  });

  /**
   * Cancel booking
   * POST /api/bookings/:id/cancel
   */
  cancelBooking = catchAsync(async (req, res, next) => {
    const { reason } = req.body;
    
    const booking = await BookingService.cancelBooking(
      req.params.id,
      req.user._id,
      reason
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { 
        booking,
        refundAmount: booking.cancellation.refundAmount
      }
    });
  });

  /**
   * Get booking statistics (Admin)
   * GET /api/bookings/statistics
   */
  getBookingStatistics = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    
    const stats = await BookingService.getBookingStatistics(
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: { statistics: stats }
    });
  });
}

export default new BookingController();