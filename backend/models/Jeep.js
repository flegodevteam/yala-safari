import mongoose from 'mongoose';

const jeepSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['basic', 'luxury', 'super-luxury'],
    default: 'basic'
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 4,
    max: 7
  },
  features: [{
    type: String,
    enum: ['ac', 'binoculars', 'cooler', 'usb-charging', 'comfortable-seats', 
           'roll-bar', 'first-aid', 'gps', 'radio', 'camera-mounts']
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  pricing: {
    morning: { type: Number, required: true },
    afternoon: { type: Number, required: true },
    extended: { type: Number, required: true },
    fullDay: { type: Number, required: true },
    overnight: Number
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    coverage: [String]
  },
  maintenance: {
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceHistory: [{
      date: Date,
      type: String,
      description: String,
      cost: Number
    }]
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'retired'],
    default: 'available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
jeepSchema.index({ registrationNumber: 1 });
jeepSchema.index({ type: 1, status: 1 });
jeepSchema.index({ driver: 1 });
jeepSchema.index({ location: '2dsphere' });

const Jeep = mongoose.model('Jeep', jeepSchema);
export default Jeep;
