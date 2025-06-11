const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);