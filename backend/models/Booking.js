// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.guestDetails;
    }
  },
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String,
    passportNumber: String,
    nicNumber: String
  },
  safari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Safari',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['private', 'shared'],
    required: true
  },
  jeep: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jeep',
    required: function() {
      return this.bookingType === 'private';
    }
  },
  sharedBookingDetails: {
    requestedSeats: Number,
    assignedSeats: [Number],
    sharedJeep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jeep'
    }
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: String,
    endTime: String
  },
  participants: {
    adults: {
      foreign: { type: Number, default: 0 },
      local: { type: Number, default: 0 }
    },
    children: {
      foreign: { type: Number, default: 0 },
      local: { type: Number, default: 0 }
    },
    totalCount: {
      type: Number,
      required: true
    }
  },
  extras: {
    meals: {
      breakfast: {
        included: Boolean,
        vegetarian: Number,
        nonVegetarian: Number,
        withEggs: Boolean
      },
      lunch: {
        included: Boolean,
        vegetarian: Number,
        nonVegetarian: Number
      }
    },
    guide: {
      type: String,
      enum: ['driver-only', 'driver-guide', 'separate-guide'],
      default: 'driver-only'
    },
    specialRequests: String
  },
  pickup: {
    required: {
      type: Boolean,
      default: false
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    time: String,
    hotel: {
      name: String,
      whatsapp: String,
      phone: String
    }
  },
  pricing: {
    breakdown: {
      safariBase: Number,
      entranceFees: Number,
      jeepRental: Number,
      meals: Number,
      guide: Number,
      pickup: Number,
      taxes: Number,
      discounts: Number
    },
    subtotal: Number,
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['online', 'bank-transfer', 'cash', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactions: [{
      transactionId: String,
      amount: Number,
      method: String,
      date: Date,
      status: String,
      reference: String,
      gateway: String,
      gatewayResponse: mongoose.Schema.Types.Mixed
    }],
    dueDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show', 'refunded'],
    default: 'pending'
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    refundAmount: Number,
    refundStatus: String
  },
  confirmation: {
    confirmedAt: Date,
    confirmationSent: Boolean,
    confirmationMethod: String
  },
  completion: {
    completedAt: Date,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: String,
      wouldRecommend: Boolean
    }
  },
  audit: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      modifiedAt: Date,
      changes: String
    }]
  },
  notifications: [{
    type: String,
    sentAt: Date,
    method: String,
    status: String
  }],
  source: {
    type: String,
    enum: ['website', 'admin', 'phone', 'walk-in', 'partner'],
    default: 'website'
  },
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate booking number
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    this.bookingNumber = `YS${year}${month}${day}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Indexes
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ safari: 1, date: 1 });
bookingSchema.index({ jeep: 1, date: 1 });
bookingSchema.index({ status: 1, date: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;