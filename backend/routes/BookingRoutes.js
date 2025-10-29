import express from "express";
import { 
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updatePaymentStatus,
  deleteBooking,
  calculatePrice,
  getBookingsByDate,
  getUserBookings
} from "../Controllers/BookingController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No Authentication Required)
// ==========================================

// Create a new booking
router.post("/bookings", createBooking);

// Calculate price preview before booking
router.post("/bookings/calculate-price", calculatePrice);

// Get user's own bookings by email or phone
router.get("/bookings/user", getUserBookings);

// ==========================================
// PROTECTED ROUTES (Authentication Required)
// ==========================================

// Get all bookings (Admin only)
router.get("/bookings", [auth, admin], getAllBookings);

// Get booking by ID
router.get("/bookings/:id", auth, getBookingById);

// Get bookings by specific date (Admin only)
router.get("/bookings/date/:date", [auth, admin], getBookingsByDate);

// Update booking details (Admin only)
router.put("/bookings/:id", [auth, admin], updateBooking);

// Update payment status (Admin only)
router.patch("/bookings/:id/payment-status", [auth, admin], updatePaymentStatus);

// Delete booking (Admin only)
router.delete("/bookings/:id", [auth, admin], deleteBooking);

export default router;