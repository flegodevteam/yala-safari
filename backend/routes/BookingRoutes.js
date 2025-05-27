const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking({
      reservationType: req.body.reservationType,
      location: req.body.location,
      block: req.body.block,
      packageType: req.body.packageType,
      duration: req.body.duration,
      visitorType: req.body.visitorType,
      mealOption: req.body.mealOption,
      paymentMethod: req.body.paymentMethod,
      numPersons: req.body.numPersons,
      pickupLocation: req.body.pickupLocation,
      whatsappNumber: req.body.whatsappNumber,
      hotelContact: req.body.hotelContact,
      accommodation: req.body.accommodation,
      totalAmount: req.body.totalAmount,
      status: req.body.status || "pending"
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;