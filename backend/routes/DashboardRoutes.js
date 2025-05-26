const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /api/dashboard/overview
router.get('/overview', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const revenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    // For demo: website visitors is random or static
    const websiteVisitors = 2345;

    // Recent bookings (latest 4)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name visitingTime date status');

    res.json({
      stats: {
        totalBookings,
        revenue,
        pendingBookings,
        websiteVisitors
      },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;