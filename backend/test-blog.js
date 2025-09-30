import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import { config } from "dotenv";

config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a test blog post
const createTestBlog = async () => {
  try {
    const testBlog = new Blog({
      title: "Welcome to Yala Safari Adventures",
      excerpt:
        "Discover the incredible wildlife and natural beauty of Yala National Park with our expert guides.",
      content:
        "Yala National Park is home to an incredible diversity of wildlife, including leopards, elephants, water buffalo, and over 200 bird species. Our experienced guides will take you on an unforgettable journey through this pristine wilderness, sharing their knowledge of the local ecosystem and helping you spot some of Sri Lanka's most magnificent creatures.",
      author: "Yala Safari Team",
      date: "2025-09-30",
      category: "Wildlife",
      image: "/assets/yaala.png",
      readTime: "5 min read",
      status: "published",
    });

    await testBlog.save();
    console.log("Test blog created successfully:", testBlog);

    // Fetch all blogs to verify
    const allBlogs = await Blog.find({ status: "published" });
    console.log("All published blogs:", allBlogs.length);

    process.exit(0);
  } catch (error) {
    console.error("Error creating test blog:", error);
    process.exit(1);
  }
};

createTestBlog();
