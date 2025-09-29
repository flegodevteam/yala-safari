import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Image from "../models/Image.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Multer setup for file uploads with better validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and random number
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Get all images (requires authentication)
router.get("/", auth, async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Upload a new image (admin only)
router.post("/", [auth, admin], (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Image upload request received");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, category } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const url = `/uploads/${req.file.filename}`;
    
    const image = new Image({
      title: title.trim(),
      url,
      category: category || 'wildlife',
      featured: false,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
    
    await image.save();
    console.log("Image saved successfully:", image);
    
    res.status(201).json(image);
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Delete an image (admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle featured (admin only)
router.patch("/:id/featured", [auth, admin], async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    image.featured = !image.featured;
    await image.save();
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
