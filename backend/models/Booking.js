const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  participants: { type: Number, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  addOns: {
    lunch: { type: Boolean, default: false },
    binoculars: { type: Boolean, default: false },
    guide: { type: Boolean, default: false },
  },
  paymentMethod: { type: String, required: true },
  cardNumber: { type: String },
  cardExpiry: { type: String },
  cardCvc: { type: String },
  totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);