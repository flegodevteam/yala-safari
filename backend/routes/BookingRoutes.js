import express from "express";
import { createBooking } from "../Controllers/BookingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/booking", auth, createBooking);

export default router;
