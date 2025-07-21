const express = require("express");
const router = express.Router();
const BookingController = require("../Controllers/BookingController");

router.post("/bookings", BookingController.createBooking);

module.exports = router;