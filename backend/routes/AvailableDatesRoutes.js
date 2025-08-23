import express from "express";
import AvailableDate from "../models/AvailableDate.js";

const router = express.Router();

// Get all available dates
router.get("/", async (req, res) => {
  const dates = await AvailableDate.find({});
  res.json(dates.map((d) => d.date));
});

// Add a new available date
router.post("/", async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required" });
  await AvailableDate.create({ date });
  res.json({ success: true });
});

export default router;
