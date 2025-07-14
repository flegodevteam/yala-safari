const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  reservationType: String, // 'private' or 'shared'
  park: String,
  block: String,
  jeepType: String,
  timeSlot: String,
  guideOption: String,
  visitorType: String, // 'foreign' or 'local'
  mealOption: String, // 'with' or 'without'
  vegOption: String,
  includeEggs: Boolean,
  includeLunch: Boolean,
  includeBreakfast: Boolean,
  selectedBreakfastItems: [String],
  selectedLunchItems: [String],
  people: Number,
  privateDate: Date,
  sharedSelectedDate: Date,
  sharedSelectedSeat: Number,
  pickupLocation: String,
  hotelWhatsapp: String,
  accommodation: String,
  passportNumber: String,
  fullName: String,
  phoneNumber: String,
  email: String,
  nicNumber: String,
  localContact: String,
  localAccommodation: String,
  totalAmount: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);