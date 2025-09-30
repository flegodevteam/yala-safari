import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import packageRoutes from "./routes/PackageRoutes.js";
import blogRoutes from "./routes/BlogRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import dashboardRoutes from "./routes/DashboardRoutes.js";
import imageRoutes from "./routes/ImageRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import AvailableJeepsRoutes from "./routes/routes/AvailableJeepsRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.url.includes("/api/images")) {
    console.log("Image route accessed:", {
      method: req.method,
      url: req.url,
      headers: {
        "content-type": req.headers["content-type"],
        authorization: req.headers["authorization"] ? "present" : "missing",
        "x-auth-token": req.headers["x-auth-token"] ? "present" : "missing",
      },
    });
  }
  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/packages", packageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/images", imageRoutes);
app.use("/api", AvailableJeepsRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
