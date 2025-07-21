const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  reservationType: String,
  park: String,
  block: String,
  jeepType: String,
  timeSlot: String,
  guideOption: String,
  visitorType: String,
  people: Number,
  fullName: String,
  phoneNumber: String,
  email: String,
  pickupLocation: String,
  hotelWhatsapp: String,
  accommodation: String,
  passportNumber: String,
  nicNumber: String,
  localContact: String,
  localAccommodation: String,
  seat: String,
  date: String,
  mealOption: String,
  vegOption: String,
  includeEggs: Boolean,
  includeLunch: Boolean,
  includeBreakfast: Boolean,
  selectedBreakfastItems: [String],
  selectedLunchItems: [String],
  total: Number,
  paymentStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);