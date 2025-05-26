const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    participants: { type: Number, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    selectedPark: { type: String, },
    Accomodation: { type: String, default: "No" },
    PickupLocation: { type: String, default: "No" },
    pickupTime: { type: String, default: "No" },
    pickupAddress: { type: String, default: "No" },     
    selectedPackage: { type: String, default:"No"}, 
    jeepType: { type: String, default:"No" },
    reservationType: { type: String, default:"No" },
    visitingTime: { type: String },
    visitorType: { type: String },
    mealOption: { type: String },
    mealType: { type: String },
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
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
