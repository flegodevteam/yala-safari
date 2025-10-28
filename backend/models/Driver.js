import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    nicNumber: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    alternatePhone: String,
    email: String,
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },
  license: {
    number: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true
    },
    issueDate: Date,
    expiryDate: {
      type: Date,
      required: true
    }
  },
  qualifications: {
    isGuide: {
      type: Boolean,
      default: false
    },
    guideRegistrationNumber: String,
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'intermediate', 'fluent', 'native']
      }
    }],
    specializations: [String],
    trainings: [{
      name: String,
      provider: String,
      date: Date,
      certificate: String
    }]
  },
  experience: {
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    wildlifeKnowledge: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    previousEmployers: [{
      company: String,
      position: String,
      from: Date,
      to: Date
    }]
  },
  availability: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    slots: [{
      startTime: String,
      endTime: String
    }]
  }],
  leaves: [{
    startDate: Date,
    endDate: Date,
    type: {
      type: String,
      enum: ['sick', 'annual', 'emergency', 'other']
    },
    reason: String,
    approved: {
      type: Boolean,
      default: false
    }
  }],
  performance: {
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
    totalReviews: {
      type: Number,
      default: 0
    },
    complaints: [{
      date: Date,
      description: String,
      resolved: Boolean,
      resolution: String
    }],
    commendations: [{
      date: Date,
      description: String,
      from: String
    }]
  },
  salary: {
    basic: Number,
    allowances: [{
      type: String,
      amount: Number
    }],
    bankDetails: {
      bankName: String,
      branch: String,
      accountNumber: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'suspended', 'terminated'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Indexes
driverSchema.index({ employeeId: 1 });
driverSchema.index({ 'personalInfo.nicNumber': 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ 'qualifications.isGuide': 1 });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;