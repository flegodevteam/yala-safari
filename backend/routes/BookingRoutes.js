const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// (Optional) Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/admin/create-booking', async (req, res) => {
  const booking = new Booking({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    participants: req.body.participants,
    date: req.body.date,
    timeSlot: req.body.timeSlot,
    addOns: {
      lunch: req.body.addOns?.lunch || false,
      binoculars: req.body.addOns?.binoculars || false,
      photographer: req.body.addOns?.photographer || false
    },
    paymentMethod: req.body.paymentMethod,
    cardDetails: {
      number: req.body.cardDetails?.number || '',
      expiry: req.body.cardDetails?.expiry || '',
      cvv: req.body.cardDetails?.cvv || ''
    },
    status: req.body.status || 'pending'
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update fields
    if (req.body.name) booking.name = req.body.name;
    if (req.body.email) booking.email = req.body.email;
    if (req.body.phone) booking.phone = req.body.phone;
    if (req.body.participants) booking.participants = req.body.participants;
    if (req.body.date) booking.date = req.body.date;
    if (req.body.timeSlot) booking.timeSlot = req.body.timeSlot;
    if (req.body.addOns) booking.addOns = req.body.addOns;
    if (req.body.paymentMethod) booking.paymentMethod = req.body.paymentMethod;
    if (req.body.cardDetails) booking.cardDetails = req.body.cardDetails;
    if (req.body.status) booking.status = req.body.status;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bookings by date range
router.get('/date-range/:startDate/:endDate', async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    
    const bookings = await Booking.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings by status
router.get('/status/:status', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;