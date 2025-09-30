import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Yala Safari Team" },
    date: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Travel Tips",
        "Wildlife",
        "Conservation",
        "Photography",
        "Family Travel",
        "Birdwatching",
      ],
    },
    image: { type: String, required: true },
    readTime: { type: String, required: true },
    status: {
      type: String,
      default: "published",
      enum: ["published", "draft"],
    },
    featuredImage: String, // Keep for backward compatibility
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
