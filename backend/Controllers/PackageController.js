import Package from '../models/Package.js';
import asyncHandler from "express-async-handler";

// Get current package/pricing
export const getPackage = asyncHandler(async (req, res) => {
  try {
    const pkg = await Package.findOne().sort({ updatedAt: -1 });
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch package" });
  }
});

// Update package/pricing (admin only)
export const updatePackage = asyncHandler(async (req, res) => {
  try {
    const { jeep, shared, meals, guide } = req.body;
    let pkg = await Package.findOne();
    if (!pkg) {
      pkg = new Package({ jeep, shared, meals, guide });
    } else {
      pkg.jeep = jeep;
      pkg.shared = shared;
      pkg.meals = meals;
      pkg.guide = guide;
    }
    await pkg.save();
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update package" });
  }
});