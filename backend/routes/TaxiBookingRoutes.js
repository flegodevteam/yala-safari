import express from "express";
import taxiBookingController from "../controllers/taxiBookingController.js";

const router = express.Router();

router.post("/", taxiBookingController.createBooking);
router.get("/", taxiBookingController.getBookings);

export default router;