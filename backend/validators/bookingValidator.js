import { body } from 'express-validator';

export const validateBookingInput = (data) => {
  const errors = [];

  // Required fields
  if (!data.safariId) errors.push('Safari ID is required');
  if (!data.bookingType) errors.push('Booking type is required');
  if (!data.date) errors.push('Date is required');
  if (!data.participants?.totalCount) errors.push('Number of participants is required');
  if (!data.paymentMethod) errors.push('Payment method is required');

  // Validate booking type
  if (!['private', 'shared'].includes(data.bookingType)) {
    errors.push('Invalid booking type');
  }

  // Validate date
  const bookingDate = new Date(data.date);
  if (bookingDate < new Date()) {
    errors.push('Booking date cannot be in the past');
  }

  // Validate participants
  if (data.participants?.totalCount > 7) {
    errors.push('Maximum 7 participants allowed per jeep');
  }

  // Validate payment method
  const validPaymentMethods = ['online', 'bank-transfer', 'cash', 'card'];
  if (!validPaymentMethods.includes(data.paymentMethod)) {
    errors.push('Invalid payment method');
  }

  // Validate guest details if no user
  if (!data.userId && !data.guestDetails?.email) {
    errors.push('Guest email is required for non-registered users');
  }

  return {
    valid: errors.length === 0,
    error: errors.join(', ')
  };
};

export const bookingValidationRules = () => {
  return [
    body('safariId').notEmpty().withMessage('Safari ID is required'),
    body('bookingType').isIn(['private', 'shared']).withMessage('Invalid booking type'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('participants.totalCount').isInt({ min: 1, max: 7 }).withMessage('Invalid number of participants'),
    body('paymentMethod').isIn(['online', 'bank-transfer', 'cash', 'card']).withMessage('Invalid payment method'),
    body('guestDetails.email').optional().isEmail().withMessage('Invalid email format'),
    body('guestDetails.phone').optional().isMobilePhone().withMessage('Invalid phone number')
  ];
};
