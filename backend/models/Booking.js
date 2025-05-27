const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    reservationType: { type: String, required: true }, // private/shared
    location: { type: String, required: true },        // yala/bundala/udawalawa
    block: { type: String },                           // block1/block4 (for yala)
    packageType: { type: String, required: true },     // basic/luxury/superLuxury
    duration: { type: String, required: true },        // morning/extendedMorning/afternoon/fullDay
    visitorType: { type: String, required: true },     // foreign/local
    mealOption: { type: String },                      // non-veg/veg/none
    paymentMethod: { type: String, required: true },   // cash/bankDeposit/bankTransfer
    numPersons: { type: Number, required: true },
    pickupLocation: { type: String },
    whatsappNumber: { type: String },
    hotelContact: { type: String },
    accommodation: { type: String },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);