const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  participants: Number,
  date: Date,
  timeSlot: String,
  addOns: {
    lunch: Boolean,
    binoculars: Boolean,
    photographer: Boolean
  },
  paymentMethod: String,
  cardDetails: {
    number: String,
    expiry: String,
    cvv: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);