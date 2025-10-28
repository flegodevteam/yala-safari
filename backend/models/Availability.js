import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  safari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Safari',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  jeeps: [{
    jeep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jeep'
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'hold', 'maintenance'],
      default: 'available'
    },
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }],
    sharedSeats: {
      total: Number,
      available: Number,
      booked: [Number]
    }
  }],
  slots: [{
    timeSlot: {
      startTime: String,
      endTime: String
    },
    totalCapacity: Number,
    bookedCapacity: Number,
    availableCapacity: Number,
    status: {
      type: String,
      enum: ['available', 'limited', 'full'],
      default: 'available'
    }
  }],
  specialConditions: {
    weatherAlert: String,
    parkClosure: Boolean,
    specialEvent: String
  },
  pricing: {
    multiplier: {
      type: Number,
      default: 1
    },
    reason: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique date per safari
availabilitySchema.index({ safari: 1, date: 1 }, { unique: true });
availabilitySchema.index({ date: 1 });
availabilitySchema.index({ 'jeeps.status': 1 });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;