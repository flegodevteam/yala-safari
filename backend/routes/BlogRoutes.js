import express from "express";
import Blog from "../models/Blog.js";
import multer from "multer";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Get all published blogs (public access for client side)
router.get("/", async (req, res) => {
  try {
    console.log("Fetching blogs for public display...");
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .select(
        "title excerpt content author date category image readTime status createdAt updatedAt"
      );

    // Transform data to ensure compatibility with frontend
    const transformedBlogs = blogs.map((blog) => ({
      id: blog._id,
      _id: blog._id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author || "Yala Safari Team",
      date: blog.date,
      category: blog.category,
      image: blog.image,
      readTime: blog.readTime,
      status: blog.status,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    console.log(`Found ${transformedBlogs.length} published blogs`);
    res.json(transformedBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get all blogs for admin (requires authentication)
router.get("/admin", auth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Create a new blog (admin only)
router.post("/", [auth, admin], async (req, res) => {
  try {
    console.log("Creating new blog post:", req.body);

    const { title, excerpt, content, date, category, image, readTime } =
      req.body;

    // Validation
    if (
      !title ||
      !excerpt ||
      !content ||
      !date ||
      !category ||
      !image ||
      !readTime
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: title, excerpt, content, date, category, image, readTime",
      });
    }

    const blogData = {
      title,
      excerpt,
      content,
      author: "Yala Safari Team",
      date,
      category,
      image,
      readTime,
      status: "published",
    };

    const blog = new Blog(blogData);
    await blog.save();

    // Transform response to match frontend expectations
    const transformedBlog = {
      id: blog._id,
      _id: blog._id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      date: blog.date,
      category: blog.category,
      image: blog.image,
      readTime: blog.readTime,
      status: blog.status,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    console.log("Blog created successfully:", transformedBlog.id);
    res.status(201).json(transformedBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res
      .status(500)
      .json({ error: "Failed to create blog post: " + err.message });
  }
});

// Update a blog (admin only)
router.patch("/:id", [auth, admin], async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// Delete a blog (admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

export default router;
