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

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/blogs', blogRoutes);

// Default route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Get all packages



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});