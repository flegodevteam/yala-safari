const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      participants,
      date,
      timeSlot,
      jeepType,
      reservationType,
      visitingTime,
      visitorType,
      mealType,
      Accomodation,
      selectedPackage,
      selectedPark,
      addOns,
      paymentMethod,
      cardNumber,
      cardExpiry,
      cardCvc,
    } = req.body;

    // Calculate total amount
    const basePrice = 50 * participants;
    let addOnsTotal = 0;
    if (addOns.lunch) addOnsTotal += 15 * participants;
    if (addOns.binoculars) addOnsTotal += 5 * participants;
    if (addOns.guide) addOnsTotal += 20;
    const totalAmount = basePrice + addOnsTotal;

    // Create booking
    const booking = new Booking({
      name,
      email,
      phone,
      participants,
      jeepType,
      reservationType,
      visitingTime,
      visitorType,
      mealType,
      selectedPark: req.body.selectedPark,
      selectedPackage: req.body.selectedPackage,
      Accomodation,
      pickupLocation: req.body.pickupLocation,
      pickupTime: req.body.pickupTime,
      pickupAddress: req.body.pickupAddress,
      date,
      timeSlot,
      addOns,
      paymentMethod,
      cardNumber: paymentMethod === 'credit-card' ? cardNumber : undefined,
      cardExpiry: paymentMethod === 'credit-card' ? cardExpiry : undefined,
      cardCvc: paymentMethod === 'credit-card' ? cardCvc : undefined,
      totalAmount,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;