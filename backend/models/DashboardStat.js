const mongoose = require('mongoose');

const dashboardStatSchema = new mongoose.Schema({
  totalBookings: Number,
  revenue: Number,
  pendingBookings: Number,
  websiteVisitors: Number,
  localVisitors: Number,
  foreignVisitors: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DashboardStat = mongoose.model('DashboardStat', dashboardStatSchema);

module.exports = DashboardStat;