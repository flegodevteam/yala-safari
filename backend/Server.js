const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/BookingRoutes');
const { default: mongoose } = require('mongoose');
const packageRoutes = require('./routes/PackageRoutes');
const blogRoutes = require('./routes/BlogRoutes');
const contactRoutes = require('./routes/ContactRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const dashboardRoutes = require('./routes/DashboardRoutes');
const imageRoutes = require('./routes/imageRoutes');
const path = require('path');
const availableDatesRoutes = require('./routes/AvailableDatesRoutes');
const dateRoutes = require("./routes/DateRoutes");
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/images', imageRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/available-dates', availableDatesRoutes);
app.use("/api", dateRoutes);





// Default route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});