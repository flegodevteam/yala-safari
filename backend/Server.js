import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import your modules (you'll need to update these files to ES modules too)
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import packageRoutes from "./routes/PackageRoutes.js";
import blogRoutes from "./routes/BlogRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import dashboardRoutes from "./routes/DashboardRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import AvailableJeepsRoutes from "./routes/routes/AvailableJeepsRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Static file serving
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes
app.use("/api/packages", packageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/images", imageRoutes);
app.use("/uploads", express.static(join(__dirname, "../uploads")));
app.use("/api", AvailableJeepsRoutes);
app.use("/api", bookingRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// dotenv.config();
// const connectDB = require("./config/db");
// const { default: mongoose } = require("mongoose");
// const packageRoutes = require("./routes/PackageRoutes");
// const blogRoutes = require("./routes/BlogRoutes");
// const contactRoutes = require("./routes/ContactRoutes");
// const adminRoutes = require("./routes/AdminRoutes");
// const dashboardRoutes = require("./routes/DashboardRoutes");
// const imageRoutes = require("./routes/imageRoutes");
// const path = require("path");
// const AvailableJeepsRoutes = require("./routes/routes/AvailableJeepsRoutes");
// const bookingRoutes = require("./routes/BookingRoutes");

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// app.use("/api/packages", packageRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/images", imageRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/api", AvailableJeepsRoutes);
// app.use("/api", bookingRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

