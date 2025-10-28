// models/Safari.js
import mongoose from 'mongoose';

const safariSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Safari name is required'],
    trim: true
  },
  park: {
    type: String,
    required: [true, 'Park is required'],
    enum: ['yala', 'bundala', 'udawalawa', 'wilpattu', 'minneriya'],
    lowercase: true
  },
  block: {
    type: String,
    enum: ['block1', 'block2', 'block3', 'block4', 'block5'],
    required: function() {
      return this.park === 'yala';
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'extended', 'fullday', 'overnight']
  },
  duration: {
    hours: {
      type: Number,
      required: true
    },
    description: String
  },
  timeSlots: [{
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    maxCapacity: {
      type: Number,
      default: 50
    }
  }],
  pricing: {
    entranceFees: {
      foreign: {
        adult: { type: Number, required: true },
        child: { type: Number, required: true }
      },
      local: {
        adult: { type: Number, required: true },
        child: { type: Number, required: true }
      }
    },
    vehicleFees: {
      type: Map,
      of: Number
    }
  },
  highlights: [String],
  wildlifeSpottingChance: {
    leopard: { type: Number, min: 0, max: 100 },
    elephant: { type: Number, min: 0, max: 100 },
    slothBear: { type: Number, min: 0, max: 100 },
    birds: { type: Number, min: 0, max: 100 }
  },
  amenities: [String],
  restrictions: [String],
  active: {
    type: Boolean,
    default: true
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
safariSchema.index({ park: 1, block: 1, type: 1 });
safariSchema.index({ active: 1 });
safariSchema.index({ averageRating: -1 });

const Safari = mongoose.model('Safari', safariSchema);
export default Safari;
