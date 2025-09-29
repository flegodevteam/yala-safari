import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true }, // File path or external URL
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    filename: { type: String }, // Stored filename
    originalName: { type: String }, // Original filename
    fileSize: { type: Number }, // File size in bytes
    mimeType: { type: String }, // MIME type of the file
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;