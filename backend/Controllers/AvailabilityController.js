// controllers/AvailabilityController.js
import AvailabilityService from '../services/AvailabilityService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

class AvailabilityController {
  /**
   * Get availability for safari
   * GET /api/availability
   */
  getAvailability = catchAsync(async (req, res, next) => {
    const { safariId, startDate, endDate, bookingType } = req.query;
    
    if (!safariId || !startDate || !endDate) {
      return next(new AppError('Safari ID, start date and end date are required', 400));
    }

    const availability = await AvailabilityService.getAvailability(
      safariId,
      startDate,
      endDate,
      bookingType
    );

    res.json({
      success: true,
      data: { availability }
    });
  });

  /**
   * Block dates (Admin)
   * POST /api/availability/block
   */
  blockDates = catchAsync(async (req, res, next) => {
    const { safariId, dates, reason } = req.body;
    
    if (!safariId || !dates || !Array.isArray(dates)) {
      return next(new AppError('Safari ID and dates array are required', 400));
    }

    const blocked = await AvailabilityService.blockDates(
      safariId,
      dates,
      reason
    );

    res.json({
      success: true,
      message: `${blocked.length} dates blocked successfully`,
      data: { blockedDates: blocked }
    });
  });

  /**
   * Update pricing multiplier (Admin)
   * POST /api/availability/pricing
   */
  updatePricing = catchAsync(async (req, res, next) => {
    const { safariId, dates, multiplier, reason } = req.body;
    
    if (!safariId || !dates || !multiplier) {
      return next(new AppError('Safari ID, dates and multiplier are required', 400));
    }

    const updated = await AvailabilityService.updatePricingMultiplier(
      safariId,
      dates,
      multiplier,
      reason
    );

    res.json({
      success: true,
      message: `Pricing updated for ${updated.length} dates`,
      data: { updatedDates: updated }
    });
  });
}

export default new AvailabilityController();
